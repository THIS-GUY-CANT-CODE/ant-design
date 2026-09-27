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

## 2. Brand book (`brand-book/index.html`)
Single self-contained HTML page with sections: Story & positioning · Logo (inline SVG, primary + mark + mono) · Colour (4–6 tokens with hex + usage) · Type (Google Fonts pair, scale) · Voice (3 do/don't pairs) · Imagery direction · Applications (business card, social post, email signature mock).
Derive the concept from something true and specific about the business (history, building, street, founder) — that's what makes it feel bespoke.

## 3. Site (`site/index.html`)
- One file, no build step, no JS framework. Google Fonts only external dependency. Target Lighthouse 95+.
- Sections, in order: hero (what + where + one CTA) · proof · services · work/menu/products · about/story · reviews · contact (map link, phone tap-to-call, hours) · footer.
- Must: mobile-first, CSS custom properties from the brand book, logical properties, `prefers-reduced-motion`, semantic HTML, alt text, visible focus.
- Must: `<meta name="robots" content="noindex">` and the concept banner (copy the one from `clients/biscuit-bunker/site/index.html`) until they pay.

## 4. meta.json
```json
{ "slug": "", "name": "", "industry": "", "area": "", "url": "", "scoreBefore": 0, "scoreAfter": 0, "status": "concept", "summary": "" }
```
`status` is `concept` until paid/permission → then `client`. The portfolio reads this; don't label concepts as clients.

## 5. After every build — improve this skill
Add one line to `LEARNINGS.md`: what took longest, what to template next time. If something repeats 3 times, turn it into a reusable snippet under `templates/`.
