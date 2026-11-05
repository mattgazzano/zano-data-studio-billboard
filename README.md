# Zano Data Studio

Static website for [zanodatastudio.com](https://zanodatastudio.com), hosted on GitHub Pages. Pure HTML, CSS, and JavaScript; no build step or runtime dependencies.

## Pages

- `index.html`: studio, featured Travel Planner, consulting services, and about.
- `travel-planner.html`: current product features, actual screenshots, compatibility, and FAQs.
- `privacy.html`: existing universal privacy policy, with shared brand presentation.
- `assets/`: shared styles, script, and optimized images.
- `scripts/smoke-test.cjs`: browser checks for all three pages at 375, 768, and 1440 pixels.

## Preview and verification

Serve this directory with `python3 -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173`.

Run `node scripts/smoke-test.cjs --target http://127.0.0.1:4173 --output /tmp/zano-site-qa` with Playwright available. `PLAYWRIGHT_MODULE` can point to an existing Playwright package; `CHROME_PATH` can select an installed Chrome binary. The runner does not install dependencies. It checks pages, internal links/assets, mobile navigation, the product gallery, FAQ interaction, and horizontal overflow. It saves desktop/mobile screenshots and a JSON report.

## Branding and product evidence

The approved navy profile SVG supplies the exact outlined DM Serif Display Z in the favicon and navigation. Palette: navy `#0A0F1A`, white `#F9FAFB`, green `#22C55E`. See `assets/images/README.md` for asset provenance.

Product copy was checked against `Trip Planner by Zano Data Studio.html` in the sibling `zano-data-studio-apps/travel_planner` checkout. Fresh screenshots are from a disposable, unchanged copy of that source, not a recreated interface. The paid HTML and private agent context are not included in this website.

### Product destinations

- Etsy: [Travel Planner](https://www.etsy.com/listing/4609387479/travel-planner-interactive-html-vacation). Purchase buttons use this active listing; Etsy remains the source of current pricing.
- YouTube: [Complete Tutorial Series](https://www.youtube.com/playlist?list=PLKkAvEyongkw). All 12 current episodes are linked in the product page, including the replacement Budget and AI-import videos.
- The existing API connections verified the listing, video processing, owner channel, and playlist order on November 4, 2026. The videos and playlist are Unlisted and can be watched via their links. The user requested making these links available on the website; their YouTube visibility settings were not changed.
- `docs/product-links-verification.json` records the checked destinations and runtimes without credentials. The tutorial section progressively enhances these links into expandable tutorial rows with privacy-enhanced YouTube embeds. No YouTube requests are made until the visitor expands an episode. Opening a tutorial closes the previous one and removes its player to stop playback; expansion does not autoplay. Without JavaScript, each row still expands to a YouTube link. No runtime API integration is required.
- Shared stylesheet and script URLs include a content-derived `?v=` value. Refresh this value on all three pages whenever the corresponding asset changes to prevent old assets from being paired with new HTML.

The pre-existing untracked `trip_planner_docs.html`, `.claude/`, and `.DS_Store` are outside this refresh. The old guide contains an unresolved `trip_planner.html` link and has not been published or linked by this work.

## Deployment

GitHub Pages serves the root of `main` automatically. **Pushing or merging into `main` publishes to production.** Review changes on a `codex/` branch first. Do not merge or push to `main` without production deployment authorization. A feature-branch push stores reviewable source only.

## Contact

matt@zanodatastudio.com
