# Go-live and handover checklist

Run this for every paid client. Tick it off in `clients/<slug>/handover.md` (copy this file).

## Before go-live
- [ ] Payment received (or deposit for the Rebrand tier)
- [ ] All `[placeholder]` and `£—` values replaced (search the site file for `[` and `£—`)
- [ ] Hours, phone, address and prices confirmed **in writing** by the client
- [ ] Real photos in, with alt text on every image
- [ ] Concept banner removed
- [ ] `<meta name="robots" content="noindex">` removed
- [ ] Their slug removed from the `noindex` header rule in `vercel.json` (or the site moved to its own project)
- [ ] Contact form wired up (Formspree, Basin or Vercel form handler), with a test submission received
- [ ] Privacy notice added if the form collects personal data
- [ ] Industry rules checked: GDC (dentists), ASA/CAP (health), CPRs (estate agents), SRA (solicitors), sunbed rules (salons)

## Go-live
- [ ] Domain DNS pointed at Vercel, with SSL active
- [ ] Old site redirected (map old URLs to new ones so Google rankings carry over)
- [ ] Google Search Console verified and sitemap submitted
- [ ] Google Business Profile website link updated
- [ ] PageSpeed (mobile) run and the score recorded in `audit.md` as `scoreAfter`

## After
- [ ] `meta.json` status changed to `client` (only with written permission to show them as a client), then the portfolio card and case study updated in `web/apps/studio/src/content/cases.ts`
- [ ] Testimonial requested (one or two lines, plus permission to use their name)
- [ ] Referral offer sent: £100 off, or a free month of Care, for each referral that becomes a client
- [ ] Care plan offered
- [ ] `pipeline.csv` updated: `live` or `care`
- [ ] One line added to `LEARNINGS.md`
