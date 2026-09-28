# Second Coat web

pnpm + Turborepo monorepo.

| Package | What |
| --- | --- |
| `apps/studio` | Next.js 16 (App Router, Turbopack, React 19, TypeScript strict, typed routes). The portfolio (`/`), concept sites (`/concepts/<slug>`) and case studies (`/work/<slug>`) |
| `packages/ui` (`@sc/ui`) | Shared motion and WebGL: Lenis smooth scroll synced to GSAP ScrollTrigger, SplitText reveals, magnetic buttons, velocity marquee, context cursor, raw-WebGL shader canvas, count-up, London-time hook, concept notice |

**Styling:** Tailwind CSS v4. Every brand sets CSS variables (`--bg --fg --muted --line --card --accent --accent-ink --alt` plus `--f-display --f-body --f-mono --f-serif`) and the Tailwind theme maps them to utilities (`bg-bg`, `text-accent`, `font-display`…). Brand tokens live in `apps/studio/src/brands/index.ts`. Fonts are self-hosted with `next/font` in `brands/fonts.ts`.

**Motion:** GSAP (ScrollTrigger, SplitText, DrawSVG) for scroll choreography, Motion for springs and UI transitions, React Three Fiber and drei for 3D. Everything checks `prefers-reduced-motion`.

## Add a concept
1. Add the brand to `apps/studio/src/brands/index.ts` (tokens, swatches, type, display settings). Add any new font to `brands/fonts.ts`.
2. Create `apps/studio/src/app/concepts/<slug>/layout.tsx` (copy an existing one: `robots: noindex`, `ConceptNotice`, `Cursor`) and `page.tsx` with `_components/`.
3. Add the case study to `apps/studio/src/content/cases.ts` (`was` = observed facts only).
4. Add the slug to `ORDER`, the capture script and the smoke test list, then run `pnpm start -p 3100` and `pnpm --filter studio capture` for the portfolio screenshots.
5. `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e`.

## When a concept becomes a client
Copy its route into a new app (`apps/<slug>`) that imports `@sc/ui`, drop the concept notice and `noindex`, and deploy it as its own Vercel project on their domain.

## Gotchas
- Tailwind doesn't scan `node_modules`, so `globals.css` has `@source` for `packages/ui`. New workspace packages need one too.
- Next 16: `params` is a Promise; `middleware` is now `proxy`; `next lint` is gone (ESLint flat config). Read `node_modules/next/dist/docs/` before relying on memory.
- `react-hooks` lint forbids `setState` directly in effects: use `useSyncExternalStore` for browser-only values (see `useLondonTime`).
- Headless screenshots: launch Chromium with `--use-gl=angle --use-angle=swiftshader` for WebGL.
