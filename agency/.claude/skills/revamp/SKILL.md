---
name: revamp
description: Rebrand one East London business and build its concept site and case study in the Next.js app (web/). Use when asked to "redo", "revamp", "rebrand" or "rebuild" a business.
---

# Revamp

Output: a new brand, a live concept at `/concepts/<slug>` and a case study at `/work/<slug>`, all in `web/apps/studio`. Research lives in `clients/<slug>/`.

## 0. The design standard (read this first)
We are not "modernising" old businesses. We're giving them a brand that could launch today. The first round of concepts failed this test: they had navy and gold, Art Deco sunbursts, synthwave grids, clipart shopfronts, gold shimmer text and heritage serifs, and the owner of this studio rightly called it 80s garbage. Don't repeat it.

**Do:**
- Build **one sharp idea from something true** (the building, the founding story, the trade object, the street). Examples: a tennis ball for Biscuit Bunker ("Fetched"), a key-cut profile for Rose, the shopfront arch for No.72, a diagonal "cut" for the salon where Sassoon once worked.
- Use **one contemporary typeface family**, set big and tight (tracking -0.04 to -0.07em), with at most one contrasting accent face used sparingly. Current shortlist: Geist, Host Grotesk, Schibsted Grotesk, Bricolage Grotesque (condensed), Instrument Sans and Serif, Gloock, Inter.
- Use a **small palette**: near-black, off-white, and one confident colour that owns the brand (chartreuse, papaya, hot rose, cobalt, cherry). Secondary colours only with a job to do (e.g. one per city on a menu).
- Keep layouts **type-led and editorial**: huge headlines, generous space, hairlines, rounded cards (24–32px), index lists, bento grids, full-bleed colour sections.
- Give each site **one signature interaction** that expresses the idea (a 3D ball, a key blade that draws itself, a sliced headline), plus the shared motion set: masked text reveals, magnetic buttons, context cursor and smooth scroll.
- Imagery: real photography when we have rights. Until then, use WebGL or shader art, 3D, typography, or clearly labelled photo placeholders. **Never clipart.**

**Don't:**
- No retro pastiche: Art Deco, synthwave or neon grids, sepia, film leaders, vanity bulbs, gold gradients or shimmer, newspaper clippings, sparkles.
- No heritage-costume palettes (navy and gold, moss and terracotta, cream and brown) or heritage serifs (Bitter, DM Serif, Fraunces, Playfair, Bodoni).
- No illustrated scenes (houses, shopfronts, rooms), emoji icons, drop-shadowed card soup, or gimmicks without an idea behind them.
- Don't treat the founding year as a design era. It's a fact to state proudly, not a costume.

## 1. Audit (`clients/<slug>/audit.md`, `meta.json`)
- Capture name, what they sell, address, hours, phone, email, socials, services, prices, story and reviews. **Only real public facts. Never invent clients, stats, awards, hours ("24/7") or testimonials.** Use clearly marked placeholders instead.
- `before/`: `node scripts/before.js <slug>` (run locally; the cloud sandbox can't reach most sites).
- The top problems go in the case study's `was` list, and **only if actually observed**. Say where they were observed.

## 2. Brand
Add the brand to `web/apps/studio/src/brands/index.ts`: tokens, 4–5 named swatches, type, display settings. Design the mark as a simple inline SVG component in the concept (`Mark`). Write the idea, body and three to four points in `content/cases.ts`.

## 3. Build the concept (`web/apps/studio/src/app/concepts/<slug>/`)
- `layout.tsx`: copy an existing one. It needs `robots: noindex`, `brandStyle(slug)`, `overflow-x-clip`, `<Cursor/>` and `<ConceptNotice/>` (required on every concept).
- `page.tsx` plus `_components/`. Sections, as the business needs them: hero with the signature moment · proof · services/menu · story · reviews · visit/contact · giant-wordmark footer. Add a mobile quick-action bar for anything people call or book.
- Live data from the browser (open now, clocks): `useLondonTime()` and `isOpenAt()` from `@sc/ui`. Never `setState` in an effect.
- Reuse `@sc/ui`: `Reveal`, `FadeIn`, `Magnetic`, `Marquee`, `Counter`, `ShaderCanvas`, `gsap`/`useGSAP`. Respect `prefers-reduced-motion` everywhere.

## 3b. Make it a real site, not a landing page
- Four to six pages with a sitemap footer, breadcrumbs, a phone drawer (`MobileMenu`) and ⌘K search (`CommandMenu` with pages, services and tools).
- At least three working tools that fit the business, built from the kit: `MapView`, `LiveDepartures`, `lookupPostcode`, `OpenNow`, `AddToCalendar`, `ShareButton`, `useSearch`, `useStored`, and forms with react-hook-form and zod. No fake submissions: send by email or phone where a real address exists, otherwise copy or download.
- Design the mark on a 64 grid in `src/brands/marks.tsx`, test it at 16px, and export `icon.svg` for the route.
- Mock every new third-party API in `tests/mocks.ts` and add a flow to `tests/features.spec.ts`.

## 4. Case study and portfolio
- Add the case to `content/cases.ts` (was / now / brand / marketing / tier) and the slug to `ORDER`.
- Add the slug to `scripts/capture.mjs` and `tests/smoke.spec.ts`. Then run `pnpm build && pnpm start -p 3100` and, in another shell, `pnpm --filter studio capture`.

## 5. Verify
`pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` from `web/`. Then **look at it**: screenshot the hero and every section at 1440 and 390, and fix anything that isn't at the level of the existing six. If it looks like a template, it's not done.

## 6. After every build, improve this skill
Add one line to `LEARNINGS.md`: what took longest and what to reuse next time. If something repeats three times, move it into `@sc/ui`.
