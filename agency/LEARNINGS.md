# Learnings

One line per build. What was slow, and what to turn into a template next time.

- 2026-09-27 · biscuit-bunker · The build sandbox can't reach client sites, so get before screenshots from a real browser. The one-file site plus one-file brand book format works well; next time extract the shared CSS (banner, buttons, grid) into `templates/`.
- 2026-09-27 · green-papaya · Listings disagreed on the address (Mare St vs Kingsland Rd), so always confirm address and hours before pitching. Added `scripts/shot.js <slug>` for after screenshots and an overflow check. Restaurants need a sticky mobile Call/Menu bar and Restaurant schema markup by default.
- 2026-09-27 · rose-locksmith · Trades search results are full of keyword-spam lead-gen domains. Search for old family shops instead ("since 19xx" on a named high street). Added `scripts/brandbook.js <slug>`, which builds the brand book from `brand.json`, so no more hand-written brand books. Grid gotcha: use `minmax(0,1fr)` for grids of fixed-ratio items or phones overflow.
- 2026-09-27 · walthamstow-osteopaths · Stale "over N years" copy is a great pitch hook, because it proves nobody maintains the site. Health businesses need an ASA/CAP check: describe treatments, never promise outcomes. Most demo time now goes on finding verifiable facts, so research first and build second.
- 2026-09-27 · wj-meade · Estate agents are the best-value prospects: high revenue per client, multiple branches (upsell), stale award badges. Lead with the valuation form and pitch the £1,200 tier.
- 2026-09-27 · clapton-beauty-parlour · Heritage press (Spitalfields Life, local Gazette) is the fastest way to find businesses with a real story. Check every historical claim wording against the source ("used the salon" is not "trained here").
- 2026-09-27 · thatched-house-dental · Dentists: GDC rules mean fees and GDC numbers go on the page. Nested-selector gotcha: use `.band>div`, not `.band div`, when inner divs exist.
- 2026-09-27 · queens-head-limehouse · "No website at all" is its own prospect type: search for heritage or community businesses that only have Tripadvisor or Facebook. Portfolio now handles a missing url. Pitch the Care plan (weekly what's-on updates) as the main value.
- 2026-09-27 · kellys-florist · Free-subdomain sites (ueniweb, wixsite, business.site) are instant prospects, so search for them directly. "90 years trading" is not the same as "90 years at this address": word the headline to match the source.
- 2026-09-27 · well-heeled · Watch for prospects competing with each other (Rose and Well Heeled both cut keys on Bethnal Green Road). Flag it in the audit and stagger the pitches. Quotes from articles must be copied from the source, not rebuilt from a search snippet.
