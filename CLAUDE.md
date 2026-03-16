# Zano Data Studio — Website Requirements Document
## For Claude Code / GitHub Pages Deployment

---

## Project Overview

**Brand:** Zano Data Studio
**URL:** zanodatastudio.com
**Type:** Billboard / brochure site — no backend, no CMS, static HTML/CSS/JS
**Deployment:** GitHub Pages (static files only)
**Purpose:**
1. Establish brand credibility for the Etsy shop and OAuth verification
2. Communicate two service lines: ready-made web apps for small businesses + data consulting
3. Host a universal privacy policy referenced by all products
4. Drive Etsy shop traffic

---

## File Structure

```
zanodatastudio/
├── index.html           ← Main billboard page
├── privacy.html         ← Universal privacy policy page
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
└── README.md
```

No build tools, no Node, no frameworks. Pure HTML/CSS/JS — GitHub Pages serves it directly with zero configuration.

---

## Design Direction

**Aesthetic:** Refined dark editorial — think Linear.app meets a boutique data consultancy. Not startup-playful, not enterprise-corporate. Sharp, confident, slightly minimal with intentional use of accent color.

**Color palette:**
- Background: `#0A0F1A` (near-black navy)
- Surface: `#111827` (dark card)
- Border: `#1F2937`
- Primary green: `#16A34A`
- Green accent: `#22C55E`
- Green glow: `rgba(22,163,74,0.15)`
- Text primary: `#F9FAFB`
- Text secondary: `#9CA3AF`
- Text muted: `#4B5563`

**Typography:**
- Display/headings: `DM Serif Display` (Google Fonts) — elegant, editorial, distinctive
- Body/UI: `DM Sans` (Google Fonts) — clean, modern, pairs perfectly with DM Serif
- Monospace accents: `JetBrains Mono` — for code-adjacent labels and badges

**Motion:**
- Page load: staggered fade-up reveals on all above-fold elements (CSS animation, 0.1s delays)
- Scroll: Intersection Observer triggers fade-up on section entry
- Hover: subtle green glow on cards, underline slide on links
- No jarring transitions — everything smooth at 300-400ms

**Feel:** Someone who opens this should immediately think "this person knows what they're doing."

---

## Page 1: index.html

### Section 1 — Navigation

Sticky top nav, transparent over hero, solid `#0A0F1A` on scroll.

**Left:** `Zano Data Studio` wordmark in DM Serif Display, white
**Right:**
- `Products` (anchor link to products section)
- `Services` (anchor link to services section)
- `Privacy Policy` (links to privacy.html)
- `Contact` button — styled as outlined green pill, links to `mailto:matt@zanodatastudio.com`

Mobile: hamburger menu that slides down with the same links.

---

### Section 2 — Hero

Full viewport height. Dark background with a subtle animated grid pattern (CSS only — thin lines at `rgba(22,163,74,0.06)`, no libraries).

**Layout:** Two-column on desktop, stacked on mobile.

**Left column:**
- Small green badge above headline: `[ Data Tools for Small Business ]` — monospace font, green border, subtle green background
- Main headline (DM Serif Display, 64px desktop / 40px mobile):
  ```
  Your data.
  Actually working
  for you.
  ```
- Subheadline (DM Sans, 18px, secondary color):
  ```
  We build dashboards, web apps, and analytics tools
  that help small business owners make better decisions —
  without needing a data team.
  ```
- Two CTA buttons side by side:
  - Primary: `Browse Products` — solid green, links to Etsy shop (placeholder URL, easy to update)
  - Secondary: `Work With Us` — outlined white, links to contact section

**Right column:**
- A dark card (surface color, green border glow) that looks like a mini dashboard preview
- Inside the card: static HTML/CSS mockup of a small KPI dashboard — 3 metric cards (Revenue, Orders, Margin) with fake numbers, a simple green line chart drawn in pure CSS, channel breakdown bars
- This is purely decorative — CSS art, not a real chart library
- Subtle green dot pulse animation in top-right corner of the card (like a live indicator)

---

### Section 3 — Products

**Section label:** `[ Products ]` in monospace green
**Heading:** `Ready-made tools. Instant value.`
**Subtext:** `Download, connect your data, and go. No setup calls, no onboarding, no contracts.`

Three product cards in a grid (3-col desktop, 1-col mobile). Each card:
- Dark surface background
- Green top border accent (3px)
- Icon (emoji or SVG)
- Product name
- One-line description
- Tag chips (e.g. `Google Sheets` `Dashboard` `Inventory`)
- `View on Etsy →` link (placeholder, update when live)

**Card 1 — Inventory Manager**
- Icon: 📦
- Name: Inventory Manager
- Description: Track stock, sales, and purchase orders with a live dashboard connected to your Google Sheet.
- Tags: `Google Sheets` `HTML Dashboard` `Small Business`

**Card 2 — Coming Soon placeholder**
- Icon: 📊
- Name: P&L Tracker *(Coming Soon)*
- Description: Profit and loss tracking built for Etsy sellers, resellers, and makers.
- Tags: `Google Sheets` `Dashboard` `Finance`
- Grayed out / locked appearance

**Card 3 — Coming Soon placeholder**
- Icon: 💰
- Name: Cash Flow Planner *(Coming Soon)*
- Description: Visualize your monthly cash position and forecast ahead with confidence.
- Tags: `Google Sheets` `Dashboard` `Finance`
- Grayed out / locked appearance

---

### Section 4 — Services

**Section label:** `[ Services ]` in monospace green
**Heading:** `Need something custom?`
**Subtext:** `7 years of data engineering, BI, and analytics architecture. Available for consulting engagements.`

Two-column layout on desktop, stacked mobile. Left is a description block, right is a services list.

**Left — positioning statement:**
```
We spend our days building analytics infrastructure
for growing companies. We bring that same rigor to
smaller engagements — without the enterprise price tag.
```

Small credibility line below:
`Based in New Jersey · Available remotely · Small team, senior talent`

**Right — services list:**

Four service blocks, each with a green check icon, title, and one-line description:

1. **Dashboard & Reporting** — Custom Looker Studio, Google Sheets, or web-based dashboards built around your actual data.

2. **Data Pipeline Setup** — Connect your tools, clean your data, and build workflows that run without manual effort.

3. **Spreadsheet Automation** — Turn your messy spreadsheets into clean, automated systems using Google Sheets and Apps Script.

4. **Analytics Audit** — A structured review of your current data setup with a clear, prioritized action plan.

Below the services list: a single CTA card with green border glow:
- Text: `Let's talk about your project`
- Subtext: `Typical engagements start at $500. Response within 24 hours.`
- Button: `Send a Message →` linking to `mailto:matt@zanodatastudio.com`

---

### Section 5 — About / Credibility

**Section label:** `[ About ]` in monospace green
**Heading:** `Built by someone who does this for a living.`

Single centered column, max-width 680px.

Body text (2-3 short paragraphs):

> I'm a data analytics manager with 7+ years building end-to-end analytics solutions — from data pipelines and modeling to BI dashboards and reporting frameworks. My day job is turning raw data into decisions for a growing SaaS company.
>
> Zano Data Studio is where I package that experience into tools and services that are actually accessible to small business owners. No bloated software subscriptions. No enterprise complexity. Just clean, functional tools that work.
>
> Every product in the shop is something I'd use myself.

Below: three small stat chips in a row:
- `7+ years in data analytics`
- `Full-stack analytics builds`
- `Based in New Jersey`

---

### Section 6 — Footer

Dark, minimal.

**Left:** `Zano Data Studio` wordmark + `© 2025 Zano Data Studio. All rights reserved.`

**Center:** Links — `Products` · `Services` · `Privacy Policy` · `Contact`

**Right:** Social/links (placeholder — add later)

Small note at very bottom:
`Zano Data Studio is not affiliated with Google LLC. Google Sheets and Looker Studio are trademarks of Google LLC.`

---

## Page 2: privacy.html

### Purpose
Universal privacy policy covering all Zano Data Studio products. Referenced in Google OAuth consent screen. Must be accessible at `zanodatastudio.com/privacy.html` or `zanodatastudio.com/privacy`.

### Header
Same nav as index.html (reuse component).

### Content

**Page title:** `Privacy Policy`
**Last updated:** `March 2025`
**Effective date:** `March 2025`

---

#### 1. Overview

Zano Data Studio ("we," "our," or "us") operates zanodatastudio.com and produces digital products and tools including Google Sheets templates, HTML dashboards, and web applications (collectively, "Products"). This Privacy Policy describes how we handle information in connection with our Products and website.

We are committed to a simple principle: **we do not collect, store, or sell your personal data.**

---

#### 2. Information We Do Not Collect

Our Products are designed with privacy as a default. Specifically:

- **Google Sheets templates** — We have no access to your Google account, your spreadsheet data, or any information you enter into our templates. All data remains in your own Google account.
- **HTML dashboard files** — Our standalone dashboard files run entirely in your local browser. They communicate directly between your browser and your own Google account. We do not operate any server that receives, processes, or stores your data.
- **Apps Script code** — Any Google Apps Script included in our templates runs under your own Google account, on your own Google infrastructure. We do not have access to the script execution, its outputs, or any data it reads from your spreadsheet.
- **Website analytics** — zanodatastudio.com does not use cookies, tracking pixels, or third-party analytics tools. We do not collect browsing data, IP addresses, or behavioral data from visitors.

---

#### 3. Google OAuth and API Access

Some of our Products use Google's OAuth authorization flow to allow our Apps Script code to read data from your Google Sheet. When you authorize this access:

- The authorization is granted **to your own copy of the script**, running under **your own Google account**
- We (Zano Data Studio) receive no credentials, tokens, or data from this authorization
- The script only requests `spreadsheets.currentonly` scope, which limits access to the single spreadsheet the script is attached to
- You can revoke access at any time via your Google Account settings at myaccount.google.com/permissions

---

#### 4. Etsy Purchases

When you purchase a product through our Etsy shop, your transaction is processed by Etsy, Inc. We receive only the information Etsy provides to sellers, which may include your name, shipping address (for physical items), and order details. We do not store this information beyond what is necessary to fulfill your order. Etsy's privacy policy governs the handling of your payment information and account data.

---

#### 5. Contact and Communications

If you contact us by email at matt@zanodatastudio.com, we will use your email address solely to respond to your inquiry. We do not add you to any mailing lists or share your contact information with third parties.

---

#### 6. Third-Party Services

Our Products may reference or integrate with the following third-party services, each governed by their own privacy policies:

- **Google LLC** — Google Sheets, Google Apps Script, Google Drive, Looker Studio
- **Etsy, Inc.** — Our primary sales platform
- **GitHub Pages** — Hosts this website

We are not responsible for the privacy practices of these services.

---

#### 7. Children's Privacy

Our Products are not directed at children under the age of 13. We do not knowingly collect any information from children.

---

#### 8. Changes to This Policy

We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of our Products after changes are posted constitutes acceptance of the updated policy.

---

#### 9. Contact

For privacy-related questions or requests, contact us at:

**Email:** matt@zanodatastudio.com
**Website:** zanodatastudio.com

---

### Privacy page styling
Same design system as index.html. Clean prose layout, max-width 720px centered. Section headings in DM Serif Display. Body in DM Sans. Green accents on section numbers/labels. "Last updated" badge in monospace at the top.

---

## Technical Requirements

### GitHub Pages compatibility
- Pure static files — no server-side code
- All paths relative (no absolute paths that break on subdirectories)
- `index.html` at root serves the homepage automatically
- No `.htaccess` or server config needed

### Performance
- All fonts loaded via Google Fonts with `display=swap`
- No JavaScript frameworks — vanilla JS only
- No external dependencies except Google Fonts and optionally one icon set (Lucide icons via CDN is fine)
- Target: loads in under 2 seconds on a 4G connection

### Responsiveness
- Mobile-first CSS
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Nav collapses to hamburger at 768px
- All sections readable and usable at 375px minimum width

### Accessibility
- Semantic HTML throughout (`nav`, `main`, `section`, `article`, `footer`)
- All images have `alt` attributes
- Color contrast meets WCAG AA minimum
- Focus states visible on all interactive elements

### SEO basics
Each page needs:
```html
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">
<link rel="canonical" href="...">
```

### README.md content
```markdown
# Zano Data Studio

Static website for zanodatastudio.com, hosted on GitHub Pages.

## Structure
- index.html — main billboard page
- privacy.html — universal privacy policy
- assets/ — CSS, JS, images

## Deployment
Push to main branch. GitHub Pages serves from root automatically.

## To update
Edit HTML files directly. No build step required.

## Contact
matt@zanodatastudio.com
```

---

## Placeholders to fill in before going live

| Item | Location | Notes |
|------|----------|-------|
| Etsy shop URL | Product card links | Replace `#` with real Etsy shop URL |
| Contact email | Nav, footer, privacy, services CTA | Currently `matt@zanodatastudio.com` |
| Social links | Footer | Add LinkedIn, X, etc. when ready |
| Product 2 & 3 | Product cards | Update when products launch |
| Google Analytics | Optional | Only add if you want traffic data |

---

## Claude Code instructions

When building this site:

1. Start with `styles.css` — define all CSS variables, typography imports, and base styles first
2. Build `index.html` section by section, referencing the CSS variables throughout
3. Build `privacy.html` reusing the nav and footer from index.html (copy-paste, not a component system — this is static HTML)
4. Build `main.js` last — handle nav scroll behavior, mobile hamburger, and Intersection Observer scroll animations
5. The CSS grid art dashboard in the hero is important — spend time making it look convincing as a decorative element
6. Test at 375px, 768px, and 1440px widths before finishing
7. Validate all anchor links work correctly
8. Ensure privacy.html is reachable from the nav on both pages
