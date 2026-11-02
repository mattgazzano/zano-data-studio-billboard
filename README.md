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

### Destinations still required

- Add a verified, public Etsy product URL when available. Current purchase/availability links intentionally open an email to `matt@zanodatastudio.com`.
- Add a verified public YouTube channel or tutorial playlist when ready. The product workspace currently references an unlisted, incomplete upload batch, so it is not promoted here.
- Confirm the final listing price before adding pricing. No price, testimonials, sales counts, or awards are asserted.

The pre-existing untracked `trip_planner_docs.html`, `.claude/`, and `.DS_Store` are outside this refresh. The old guide contains an unresolved `trip_planner.html` link and has not been published or linked by this work.

## Deployment

GitHub Pages serves the root of `main` automatically. **Pushing or merging into `main` publishes to production.** Review changes on a `codex/` branch first. Do not merge or push to `main` without production deployment authorization. A feature-branch push stores reviewable source only.

## Contact

matt@zanodatastudio.com
