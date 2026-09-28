# Second Coat: agency workspace

We rebuild East London businesses as modern brands, with the website to match, before they pay. See `PLAN.md` for the offer, pricing and guardrails.

| Path | What |
| --- | --- |
| `web/` | **The websites.** pnpm + Turborepo monorepo: `apps/studio` (Next.js 16) serves the Second Coat portfolio, the six concept sites (`/concepts/<slug>`) and their case studies (`/work/<slug>`). See `web/README.md` |
| `clients/<slug>/` | Research for each business: `audit.md` (verified facts and observed problems), `meta.json`, `before/` |
| `.claude/skills/` | The machine: `prospect`, `revamp` and `outreach` skills |
| `research/` | Design research by sector (e.g. what the best production-company sites do) |
| `scripts/find-prospects.js [trades…] --areas "A,B"` | **Run locally with a Google Places API key.** Finds businesses with 20+ reviews, audits their websites and writes a ranked `prospects/<date>.csv` |
| `scripts/healthcheck.js <url> "Name"` | Free one-page website health-check report (a lead magnet) |
| `scripts/before.js [slug]` | **Run locally.** Screenshots a business's current site into `before/` |
| `scripts/dashboard.js` | Builds `internal/dashboard.html` (lead funnel, next action per lead) |
| `pipeline.csv` | Lead tracker |
| `outreach/`, `sales/` | Pitches, proposal, terms, intake, handover checklist, partners and grants |
| `finance/` | 12-month financial model |
| `LEARNINGS.md` | One line per build: what to improve next time |

## Quick start
```bash
cd web
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e
```

## Deploy
- **Vercel:** import the repo and set the project's Root Directory to `agency/web/apps/studio` (Vercel detects the pnpm workspace). `next.config.ts` sends `noindex` for `/concepts` and `/work`; `robots.ts` disallows them.
- **GitLab:** push this folder to a GitLab project and add `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as CI variables. `.gitlab-ci.yml` runs lint, typecheck, build and Playwright smoke tests, then deploys previews on branches and production on the default branch.
- Before launch: set the studio email in `web/apps/studio/src/content/studio.ts` and `NEXT_PUBLIC_SITE_URL` in Vercel.
