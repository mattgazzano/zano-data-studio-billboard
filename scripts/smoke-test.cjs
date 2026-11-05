/* Run with an existing Playwright installation; no dependencies are installed. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const args = process.argv.slice(2);
function option(name, fallback) { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; }
const target = option('--target', 'http://127.0.0.1:4173').replace(/\/$/, '');
const output = option('--output', '/tmp/zano-site-qa');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
fs.mkdirSync(output, {recursive:true});

(async function () {
  const launch = {headless:true};
  if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH;
  const browser = await chromium.launch(launch);
  const report = {target, pages:[], controlsAttempted:0, errors:[], brokenLinks:[], failedRequests:[], noJavaScript:false};
  const external = new Set();
  const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/product-links-verification.json'), 'utf8'));
  try {
    for (const width of [375, 768, 1440]) {
      const context = await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
      // Verify navigation in isolated popup pages without loading third-party trackers.
      for (const pattern of ['https://www.etsy.com/listing/**','https://www.youtube.com/**','https://www.youtube-nocookie.com/**']) {
        await context.route(pattern, route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Outbound navigation check</title>'}));
      }
      const page = await context.newPage();
      async function checkOutbound(link, expected) {
        const [popup] = await Promise.all([page.waitForEvent('popup'),link.click()]);
        await popup.waitForLoadState('domcontentloaded');
        assert.equal(popup.url(), expected);
        await popup.close();
        report.controlsAttempted++;
      }
      page.on('pageerror', error=>report.errors.push({width,error:error.message}));
      page.on('console', message=>{if(message.type()==='error') report.errors.push({width,error:message.text()});});
      page.on('requestfailed', request=>report.failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
      for (const route of ['index.html','travel-planner.html','privacy.html']) {
        const response = await page.goto(target+'/'+route,{waitUntil:'networkidle'});
        assert.equal(response.status(),200,route);
        await page.evaluate(()=>document.fonts.ready);
        await page.locator('footer').scrollIntoViewIfNeeded();
        await page.evaluate(()=>scrollTo(0,0));
        await page.evaluate(()=>document.querySelectorAll('img[loading="lazy"]').forEach(image=>image.loading="eager"));
        await page.waitForFunction(()=>Array.from(document.images).every(image=>!image.getClientRects().length||image.complete));
        const state = await page.evaluate(()=>({
          overflow:document.documentElement.scrollWidth>innerWidth,
          h1:document.querySelectorAll('h1').length,
          brokenImages:Array.from(document.images).filter(image=>image.getClientRects().length&&!image.naturalWidth).map(image=>image.src),
          missingAlt:Array.from(document.images).filter(image=>!image.hasAttribute('alt')).map(image=>image.src),
          duplicateIds:Array.from(document.querySelectorAll('[id]')).map(el=>el.id).filter((id,index,all)=>all.indexOf(id)!==index),
          emDash:document.body.textContent.includes('—'),
          links:Array.from(document.querySelectorAll('a[href]')).map(a=>({href:a.getAttribute('href'),url:a.href})),
          assets:Array.from(document.querySelectorAll('img[src],script[src],link[rel="stylesheet"],link[rel="icon"]')).map(el=>el.src||el.href)
        }));
        assert.equal(state.overflow,false,route+' overflow at '+width);
        assert.equal(state.h1,1,route+' h1');
        assert.deepEqual(state.brokenImages,[],route+' broken images');
        assert.deepEqual(state.missingAlt,[],route+' missing alt');
        assert.deepEqual(state.duplicateIds,[],route+' duplicate ids');
        assert.equal(state.emDash,false,route+' em dash');
        for (const link of state.links) {
          assert.notEqual(link.href,'#',route+' placeholder link');
          if (link.url.startsWith(target)) {
            const url = new URL(link.url);
            const res = await context.request.get(url.origin+url.pathname);
            if(res.status()!==200) report.brokenLinks.push(link.url);
            if (url.hash) {
              const html = await res.text();
              if(!html.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"')) report.brokenLinks.push(link.url);
            }
          } else if(!link.url.startsWith('mailto:')) external.add(link.url);
        }
        for (const asset of state.assets.filter(url=>url.startsWith(target))) {
          const res=await context.request.get(asset);
          assert.equal(res.status(),200,asset);
        }
        if(width===375) {
          const toggle=page.locator('.nav-hamburger');
          await toggle.click(); report.controlsAttempted++;
          await assert.doesNotReject(()=>page.locator('#mobile-menu').waitFor({state:'visible'}));
          await page.keyboard.press('Escape'); report.controlsAttempted++;
          assert.equal(await toggle.getAttribute('aria-expanded'),'false');
          await toggle.click(); report.controlsAttempted++;
          await page.locator('#mobile-menu a').first().click(); report.controlsAttempted++;
          assert.equal(await toggle.getAttribute('aria-expanded'),'false');
          await page.goto(target+'/'+route,{waitUntil:'networkidle'});
          await page.evaluate(()=>document.fonts.ready);
          await page.evaluate(()=>scrollTo(0,0));
        }
        if(route==='travel-planner.html') {
          for(const name of ['Home','Bookings','Timeline','Budget','Packing']) {
            await page.getByRole('tab',{name,exact:true}).click(); report.controlsAttempted++;
            assert.equal(await page.getByRole('tab',{name,exact:true}).getAttribute('aria-selected'),'true');
            assert.equal(await page.getByRole('tabpanel').count(),1);
            await page.getByRole('tabpanel').locator('img').evaluate(image=>image.decode());
          }
          await page.getByRole('tab',{name:'Packing',exact:true}).press('ArrowRight'); report.controlsAttempted++;
          assert.equal(await page.getByRole('tab',{name:'Home',exact:true}).getAttribute('aria-selected'),'true');
          await page.getByRole('tab',{name:'Home',exact:true}).press('End'); report.controlsAttempted++;
          assert.equal(await page.getByRole('tab',{name:'Packing',exact:true}).getAttribute('aria-selected'),'true');
          await page.getByRole('tab',{name:'Packing',exact:true}).press('Home'); report.controlsAttempted++;
          for(const summary of await page.locator('.faq-list summary').all()) {
            await summary.click(); report.controlsAttempted++;
            assert.equal(await summary.evaluate(el=>el.parentElement.open),true);
            await summary.click(); report.controlsAttempted++;
          }
          await page.evaluate(()=>scrollTo(0,0));
        }
        if(route!=='privacy.html') {
          await checkOutbound(page.locator('.btn-etsy').first(),destinations.etsy.url);
          if(route==='index.html') {
            await page.locator('.tutorial-shortcut').click(); report.controlsAttempted++;
            assert.equal(page.url(),target+'/travel-planner.html#tutorials');
            await page.locator('.tutorial-episode summary').first().waitFor({state:'visible'});
            await page.goto(target+'/index.html',{waitUntil:'networkidle'});
            await page.locator('.product-spotlight').screenshot({path:path.join(output,'product-card-'+width+'.png')});
          } else {
            const lessons=page.locator('.tutorial-list > li a');
            assert.equal(await lessons.count(),12);
            for(let i=0;i<12;i++) {
              const url=new URL(await lessons.nth(i).getAttribute('href'));
              assert.equal(url.searchParams.get('v'),destinations.youtube.videos[i].id);
              assert.equal(url.searchParams.get('list'),destinations.youtube.playlist_id);
              assert.equal(await lessons.nth(i).getAttribute('target'),'_blank');
            }
            await page.locator('.product-heading .btn-youtube').click(); report.controlsAttempted++;
            assert.equal(new URL(page.url()).hash,'#tutorials');
            await checkOutbound(page.locator('#tutorials .btn-youtube'),'https://www.youtube.com/playlist?list='+destinations.youtube.playlist_id);
            assert.equal(await page.locator('.tutorial-screen iframe').count(),0,'no embed before expansion');
            assert.equal(await page.locator('.tutorial-episode[open]').count(),0,'all episodes start collapsed');
            await page.locator('#tutorials').screenshot({path:path.join(output,'tutorial-collapsed-'+width+'.png')});
            const episodes=page.locator('.tutorial-episode');
            for(let index=0;index<12;index++) {
              const episode=episodes.nth(index);
              if(index===0) await episode.locator('summary').press('Enter');
              else await episode.locator('summary').click();
              report.controlsAttempted++;
              const frame=episode.locator('iframe');
              await frame.waitFor({state:'visible'});
              await page.waitForFunction(()=>document.querySelectorAll('.tutorial-screen iframe').length===1);
              assert.equal(await page.locator('.tutorial-episode[open]').count(),1,'only one tutorial expanded');
              const source=new URL(await frame.getAttribute('src'));
              assert.equal(source.hostname,'www.youtube-nocookie.com');
              assert.equal(source.pathname,'/embed/'+destinations.youtube.videos[index].id);
              assert.equal(source.searchParams.get('autoplay'),'0');
              assert.equal(await frame.getAttribute('referrerpolicy'),'strict-origin-when-cross-origin');
              assert.ok((await frame.getAttribute('title')).includes(await episode.locator('strong').textContent()));
              const box=await frame.boundingBox();
              assert.ok(box.width>=200&&box.height>=200,'minimum YouTube embed dimensions');
              const row=await episode.boundingBox();
              assert.ok(box.x>=row.x&&box.x+box.width<=row.x+row.width,'player fits the expanded row');
              if(index===0) await episode.screenshot({path:path.join(output,'tutorial-expanded-'+width+'.png')});
            }
            await checkOutbound(episodes.nth(11).locator('.tutorial-external'),await lessons.nth(11).getAttribute('href'));
            await episodes.nth(11).locator('summary').press('Enter'); report.controlsAttempted++;
            await page.waitForFunction(()=>!document.querySelector('.tutorial-screen iframe'));
            assert.equal(await page.locator('.tutorial-episode[open]').count(),0,'collapse stops playback');
            await page.locator('#tutorials').screenshot({path:path.join(output,'tutorial-library-'+width+'.png')});
          }
          await page.evaluate(()=>scrollTo(0,0));
        }
        await page.screenshot({path:path.join(output,route.replace('.html','')+'-'+width+'.png'),fullPage:true});
        report.pages.push({route,width,overflow:false,images:'loaded',links:state.links.length});
      }
      await context.close();
    }
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:1000}});
    const page=await context.newPage();
    for(const route of ['index.html','travel-planner.html','privacy.html']) {
      await page.goto(target+'/'+route);
      assert.equal(await page.locator('.nav-links').isVisible(),true,'navigation without JS');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no-JS overflow');
      if(route==='travel-planner.html') {
        assert.equal(await page.locator('.preview-panel:visible').count(),5);
        assert.equal(await page.locator('.tutorial-episode').count(),12);
        await page.locator('.tutorial-episode summary').first().click();
        assert.equal(await page.locator('.tutorial-external').first().isVisible(),true);
        assert.equal(await page.locator('.tutorial-screen iframe').count(),0);
        assert.equal(await page.locator('.tutorial-list a[target="_blank"]').count(),12);
      }
    }
    report.noJavaScript=true;
    report.externalLinks=Array.from(external);
    assert.deepEqual(report.errors,[],'browser errors');
    assert.deepEqual(report.failedRequests,[],'failed requests');
    assert.deepEqual(report.brokenLinks,[],'broken internal links');
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({status:'passed',pages:report.pages.length,controlsAttempted:report.controlsAttempted,errors:report.errors,brokenLinks:report.brokenLinks,noJavaScript:report.noJavaScript,output}));
  } catch (error) {
    report.failure=error.stack;
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
    throw error;
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
