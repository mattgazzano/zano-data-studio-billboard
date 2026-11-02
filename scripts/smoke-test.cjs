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
  try {
    for (const width of [375, 768, 1440]) {
      const context = await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
      const page = await context.newPage();
      page.on('pageerror', error=>report.errors.push({width,error:error.message}));
      page.on('console', message=>{if(message.type()==='error') report.errors.push({width,error:message.text()});});
      page.on('requestfailed', request=>report.failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
      for (const route of ['index.html','travel-planner.html','privacy.html']) {
        const response = await page.goto(target+'/'+route,{waitUntil:'networkidle'});
        assert.equal(response.status(),200,route);
        await page.evaluate(()=>document.fonts.ready);
        await page.locator('footer').scrollIntoViewIfNeeded();
        await page.evaluate(()=>scrollTo(0,0));
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
          for(const summary of await page.locator('summary').all()) {
            await summary.click(); report.controlsAttempted++;
            assert.equal(await summary.evaluate(el=>el.parentElement.open),true);
            await summary.click(); report.controlsAttempted++;
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
      if(route==='travel-planner.html') assert.equal(await page.locator('.preview-panel:visible').count(),5);
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
