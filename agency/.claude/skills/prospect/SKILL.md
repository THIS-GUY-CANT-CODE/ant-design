---
name: prospect
description: Find and score East London small businesses with weak websites as revamp candidates. Use when asked to find new prospects, leads, or "the next business to redo".
---

# Prospect

Goal: a shortlist of businesses where a redesign is obviously better *and* the owner can afford £500+.

## Fastest route
Run `node scripts/find-prospects.js` on a machine with `GOOGLE_PLACES_API_KEY` set. It gives a ranked CSV of real businesses (20+ reviews) with weak sites, already flagged. Take the top rows, check them by eye, then add them to `pipeline.csv`.

## Where to look (manual)
- Google Maps searches like "<trade> <area> London". Areas: Hackney, Shoreditch, Bethnal Green, Whitechapel, Bow, Stratford, Leyton, Walthamstow, Dalston, Clapton, Hackney Wick, Canning Town.
- Industries that convert best: trades, physio/dental/clinics, independent restaurants, salons/barbers, accountants/solicitors, venues, studios.
- Skip chains, franchises, and anyone whose site was clearly rebuilt in the last 2 years.

## Scoring rubric (current site, out of 50; lower means a better prospect)
| Area | 0 (bad) → 10 (good) |
| --- | --- |
| Mobile | Broken layout, tiny text, horizontal scroll → flawless |
| Speed | PageSpeed mobile < 40 → > 90 |
| Clarity | Can't tell what they do / where / how to contact in 5s → instant |
| Trust | No reviews, dead links, © 2016, stock photos → strong social proof |
| Conversion | No CTA/phone/booking above the fold → one-tap call/book |

Prospect if score ≤ 25 **and** the business has ≥ 20 Google reviews (proves they're real and trading).

## Output
Append a row to `pipeline.csv`:
`slug,name,url,area,industry,score,reviews,contact_email,status,date`

Create `clients/<slug>/audit.md` using the audit template in the `revamp` skill.
