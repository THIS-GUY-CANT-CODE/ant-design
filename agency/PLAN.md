# Second Coat: a brand and web studio made in East London, working UK-wide and worldwide

> Working name. "Second Coat": we give tired small-business websites a fresh coat. Swap it if you have a better one.

## The offer

**We rebuild your website before you pay a penny.** We pick a local business with a weak site, build a working redesign, send them a private link, and they pay only if they want it live.

| Tier | Price | What they get |
| --- | --- | --- |
| Refresh | £500 | New one-page site built on the demo, their domain, hosting setup, contact form, 1 round of edits |
| Rebrand | £1,200 | Refresh plus a full brand book (logo, palette, type, voice, social templates) and up to 5 pages |
| Care plan | £49/mo | Hosting, SSL, monthly content edits, uptime checks, a quarterly SEO report |

Why tiers: £500 on its own only works if a demo takes under 3 hours. The £49/mo care plan is where the money compounds. 40 care clients is about £23.5k a year of recurring revenue before any new sales.

## Unit economics (target)

> **See `finance/README.md`.** The model shows conversion and price, not volume, are what raise the hourly rate. Base plan is about £26k/yr at £28/hr. Warm leads plus a £750 Refresh is about £65k/yr at £57/hr.


- Demo build time: 2 to 3 hours with the pipeline in `.claude/skills/`, down to 90 minutes by site 20
- Demo-to-paid conversion: aim for 1 in 8 cold demos, 1 in 3 warm or referred ones
- Cost per demo: about £0 (Vercel hobby preview), plus your outreach time
- Break-even: 1 sale per 8 demos at £500 is £62 an hour at 1 hour of outreach per demo

## The machine (repeatable pipeline)

1. **Prospect**: find East London businesses with weak sites (see `.claude/skills/prospect/SKILL.md` for the scoring rubric)
2. **Audit**: score the current site out of 50 and screenshot it (`clients/<slug>/audit.md`)
3. **Brand**: a contemporary identity with one idea taken from their real story (see the design standard in the revamp skill)
4. **Build**: the concept site and case study in the Next.js app (`web/`), on their real content
5. **Deploy**: private preview URL on Vercel, `noindex`, with a "concept" banner
6. **Pitch**: send email and a Loom-style walkthrough (templates in `.claude/skills/outreach/SKILL.md`)
7. **Close**: Stripe payment link, domain handover, and remove the concept banner
8. **Learn**: log the result in `pipeline.csv`, then feed what worked back into the skill files

Every step lives as a skill in `.claude/skills/` so any session (or a contractor) can run it the same way. Improve those files after every client. That feedback loop is how this gets better on its own.

## Legal / reputation guardrails (do not skip)

- **Portfolio labelling.** Until a business pays or gives written permission, show them as an *"Unsolicited concept for …"*, never as a client. Implying a client relationship that doesn't exist breaks the CAP Code and is a quick way to get a solicitor's letter.
- **Previews are `noindex`** and carry a visible "Concept by Second Coat, not the official site" banner, so nobody mistakes the demo for the real business.
- **Use only their public copy and your own or licensed imagery.** Don't lift their photos into a public portfolio without permission. Placeholders are fine in demos.
- **Cold email (PECR)**: emailing a business's generic address (info@, hello@) is fine. Always include an opt-out line and your company details.

## Portfolio concepts

| # | Business | Area | Industry | Status |
| - | --- | --- | --- | --- |
| 1 | Biscuit Bunker | Shoreditch, EC2A | Video production | Rebranded, live concept + case study (new stack) |
| 2 | Green Papaya Xi'Viet | Hackney, E8 | Restaurant (Vietnamese and Xi'an) | Rebranded, live concept + case study (new stack) |
| 3 | Rose Locksmith & DIY | Bethnal Green, E2 | Trades (locksmith and hardware) | Rebranded, live concept + case study (new stack) |
| 4 | Walthamstow Osteopaths | Walthamstow Village, E17 | Health (osteopathy) | Rebranded, live concept + case study (new stack) |
| 5 | W J Meade | Bow, E3 | Professional services (estate agent) | Rebranded, live concept + case study (new stack) |
| 6 | Clapton Beauty Parlour | Lower Clapton, E5 | Beauty (hair and beauty salon) | Rebranded, live concept + case study (new stack) |
| 7 | The Thatched House Dental Practice | Leytonstone, E15 | Health (private dentist) | Audited; queued for the new treatment |
| 8 | The Queen's Head | Limehouse, E14 | Hospitality (community pub, no website) | Audited; queued for the new treatment |
| 9 | Kelly's Florist | Well Street, E9 | Retail (florist, free template site) | Audited; queued for the new treatment |
| 10 | Well Heeled | Bethnal Green, E2 | Trades (shoe repair, no website) | Audited; queued for the new treatment |
| 11 | Newham Bookshop | Upton Park, E13 | Retail (independent bookshop) | Audited; queued for the new treatment |
| 12 | Repton Boxing Club | Bethnal Green, E2 | Community / sport (two competing sites) | Audited; queued for the new treatment |
| 13 | Abbott's Interiors | Roman Road, E3 | Trades (blinds, shutters, flooring; est. 1882) | Audited; queued for the new treatment |
| 14 | Driving Force | Walthamstow, E17 | Trades (garage, keyword-stuffed title) | Audited; queued for the new treatment |
| 15 | Brick Lane Bookshop | Brick Lane, E1 | Retail (bookshop, messy URLs, two domains) | Audited; queued for the new treatment |
| 16 | Bowling & Co Solicitors | Stratford, E15 | Professional (solicitors, spam titles) | Audited; queued for the new treatment |
| 17 | Denningtons Florist | Roman Road, E3 | Retail (wedding and funeral florist) | Audited; queued for the new treatment |
| 18 | F. Cooke | Hoxton, N1 | Hospitality (pie and mash, no website) | Audited; queued for the new treatment |

The industries are spread on purpose so the portfolio shows range. Trades and health have the worst sites and the highest lifetime value.

## Growth after proof of concept

**Channels first, then volume.** See `sales/partners.md`. In priority order: borough grants that pay for the site (Tower Hamlets match funding), the East End Trades Guild (about 300 independents), local heritage press once there are real clients, accountant referrals, and street-wide deals via town-centre teams.


1. Month 1: 6 portfolio pieces, portfolio site live, 30 demos sent
2. Month 2: first 3 to 5 paying clients, and turn each one into a real case study with permission
3. Month 3: go narrow on the best-converting industry (probably trades). Niche templates cut build time in half
4. Referral: £100 off, or 1 free month of care, for each referral that converts
5. Later: a white-label arrangement with local accountants and co-working spaces, who all have small-business clients

## Tooling status

- **Stack:** `web/` is a pnpm + Turborepo monorepo. Next.js 16, React 19, TypeScript, Tailwind v4, GSAP, Motion, Lenis and React Three Fiber, with ESLint, Prettier and Playwright. See `web/README.md`.
- **GitLab:** `.gitlab-ci.yml` runs lint, typecheck, build and smoke tests, then deploys to Vercel. Create a GitLab project from this folder and add the three Vercel variables.
- **Vercel:** Root Directory `agency/web/apps/studio`. Concepts and case studies are `noindex`.
- **Design standard:** contemporary brands only, with no heritage costume. See `.claude/skills/revamp/SKILL.md`.
