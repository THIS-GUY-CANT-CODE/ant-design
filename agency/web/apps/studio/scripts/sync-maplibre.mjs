// Copies MapLibre's web worker into public/, where the map loads it from (see @sc/ui map.tsx).
// MapLibre v6 finds its worker next to its own module file at runtime, which bundlers don't copy.
// Run after upgrading maplibre-gl: pnpm --filter studio sync:maplibre
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(join(process.cwd(), '../../packages/ui/package.json'));
const pkg = require.resolve('maplibre-gl/package.json');
const { version } = JSON.parse(readFileSync(pkg, 'utf8'));
const dist = join(dirname(pkg), 'dist');
mkdirSync('public/maplibre', { recursive: true });
for (const f of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) copyFileSync(join(dist, f), join('public/maplibre', f));
writeFileSync('public/maplibre/VERSION', version + '\n');
console.log('maplibre worker', version);
