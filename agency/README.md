# Second Coat: agency workspace

We rebuild East London businesses' websites before they pay. See `PLAN.md` for the offer, pricing and guardrails.

| Path | What |
| --- | --- |
| `index.html` | The agency portfolio site (generated, don't hand-edit) |
| `clients/<slug>/` | For each business: `audit.md`, `brand.json`, `brand-book/`, `site/`, `before/`, `after/`, `meta.json` |
| `.claude/skills/` | The machine: `prospect`, `revamp` and `outreach` skills |
| `scripts/brandbook.js <slug>` | Builds the brand book from `brand.json` |
| `scripts/before.js [slug]` | **Run locally.** Screenshots each client's current site and writes `before/report.md` (load time, mobile overflow, missing tap-to-call, copyright year) |
| `scripts/shot.js <slug>` | After screenshots plus overflow and JS error checks |
| `scripts/portfolio.js` | Rebuilds `index.html` from every client's `meta.json` |
| `outreach/first-six.md` | Pitch emails for every concept |
| `sales/` | Proposal template, terms, go-live and handover checklist |
| `scripts/dashboard.js` | Builds `internal/dashboard.html` (lead funnel, next action per lead). Open it locally |
| `pipeline.csv` | Lead tracker |
| `LEARNINGS.md` | One line per build: what to improve next time |

## Build a new client
```bash
# research → write clients/<slug>/{audit.md,meta.json,brand.json,site/index.html}
node scripts/brandbook.js <slug>
NODE_PATH=$(npm root -g) node scripts/shot.js <slug>   # needs Playwright
node scripts/portfolio.js
```

## Deploy
- **Vercel:** import the repo, set the root directory to `agency/`, framework "Other", no build command. `vercel.json` adds `noindex` headers to all client concepts. `.vercelignore` keeps `internal/`, `outreach/`, `sales/`, `scripts/` and `pipeline.csv` off the public site.
- **GitLab:** push this folder to a GitLab project and add a `VERCEL_TOKEN` CI variable. `.gitlab-ci.yml` deploys previews on branches and production on `main`.

## Capture before screenshots (on your machine)
```bash
cd agency/scripts && npm install && npx playwright install chromium
npm run before            # all clients, or: npm run before -- rose-locksmith
npm run portfolio         # turns on the before/after sliders
```

## Before going public
- Replace `hello@example.com` in `scripts/portfolio.js` with the real agency email, and rebuild.
- Run `npm run before` (above) to switch on the before/after sliders.
