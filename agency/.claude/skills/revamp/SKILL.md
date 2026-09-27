---
name: revamp
description: Build the before/after package for one business - audit, brand book, and new one-page site - in clients/<slug>/. Use when asked to "redo", "revamp" or "rebuild" a business website.
---

# Revamp

Target: 2–3 hours per business. Output lives in `clients/<slug>/`:

```
audit.md          # scores + problems + what we'll fix
before/           # screenshots of the current site (desktop.png, mobile.png)
brand-book/index.html
site/index.html   # the demo
meta.json         # used by the portfolio page
```

## 1. Audit (`audit.md`)
- Capture: name, what they sell, address, hours, phone, email, socials, services, prices, story, reviews. **Only real public facts. Never invent clients, stats, awards or testimonials** — use clearly marked placeholders instead.
- Screenshot desktop (1440px) + mobile (390px) into `before/`. If the sandbox can't reach the site, ask the user to drop screenshots in.
- Score with the rubric from the `prospect` skill. List the top 5 problems in plain English (these become the pitch).

## 2. Brand book (`brand.json` → `brand-book/index.html`)
Write `clients/<slug>/brand.json` (copy `clients/rose-locksmith/brand.json` as the template), then run
`node scripts/brandbook.js <slug>`. Sections: Story & positioning · Logo (inline SVG using `var(--l1/--l2/--l3)`) · Colour (6 swatches) · Type (Google Fonts pair) · Voice (3 do/don't pairs) · Imagery · Applications.
Derive the concept from something true and specific about the business (founding year, building, street, founder). That's what makes it feel bespoke. Proven concepts so far: origin building (Biscuit Bunker, No.72), founding era (1930 → Art Deco), trade object (key, papaya), local architecture (roofline M).

## 3. Site (`site.json` → `site/index.html`)
**Default:** write `clients/<slug>/site.json` (copy `clients/newham-bookshop/site.json` or `clients/repton-boxing-club/site.json`) and run `node scripts/site.js <slug>`. It uses the colours, fonts and logo from `brand.json`. Section types: `hero`, `stats`, `cards`, `menu`, `split`, `timeline`, `steps`, `quote`, `faq`, `band`, `visit`. Optional: `hours` (by day number, 0 = Sunday), `hoursTitle`, `openRanges` (enables the live open/closed pill), `schemaType`, `radius`, `buttonRadius`, `mobileBar`.
Hand-write the HTML only when a concept needs a layout the generator can't do. That takes about 5× longer.

- One file, no build step, no JS framework. Google Fonts only external dependency. Target Lighthouse 95+.
- Sections, in order: hero (what + where + one CTA) · proof · services · work/menu/products · about/story · reviews · contact (map link, phone tap-to-call, hours) · footer.
- Must: mobile-first, CSS custom properties from the brand book, logical properties, `prefers-reduced-motion`, semantic HTML, alt text, visible focus.
- Must: `<meta name="robots" content="noindex">` and the concept banner (copy the one from `clients/biscuit-bunker/site/index.html`) until they pay.

## 3b. Verify
`NODE_PATH=$(npm root -g) node scripts/shot.js <slug>` saves after screenshots and fails on horizontal overflow, JS errors or unreadable text (contrast under 2.5:1). Run it with `VERBOSE=1` to also list weaker-contrast warnings. Look at desktop.png and mobile.png before committing. Watch for: grids of fixed-ratio items need `minmax(0,1fr)`; hide the header CTA under 520px if there's a sticky mobile bar.

## 4. meta.json
```json
{ "slug": "", "name": "", "industry": "", "area": "", "url": "", "scoreBefore": 0, "scoreAfter": 0, "status": "concept", "summary": "" }
```
`status` is `concept` until paid/permission → then `client`. The portfolio reads this; don't label concepts as clients.

## 4b. Portfolio
`node scripts/portfolio.js` rebuilds the agency homepage (`index.html`) from every `meta.json`. Once `before/desktop-card.jpg` exists (a 1440×900 screenshot of their current site), the card becomes a before/after slider automatically.

## 5. After every build — improve this skill
Add one line to `LEARNINGS.md`: what took longest, what to template next time. If something repeats 3 times, turn it into a reusable snippet under `templates/`.
