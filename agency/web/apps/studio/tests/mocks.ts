import type { Page } from '@playwright/test';

/* Realistic responses for every third-party API the sites call, so tests run offline and repeatably. */

const POSTCODES: Record<string, { lat: number; lng: number; district: string; ward: string }> = {
  E27DG: { lat: 51.5267, lng: -0.0679, district: 'Tower Hamlets', ward: 'Weavers' },
  E20AA: { lat: 51.5301, lng: -0.0569, district: 'Tower Hamlets', ward: 'Bethnal Green West' },
  N16XX: { lat: 51.5465, lng: -0.0768, district: 'Hackney', ward: 'De Beauvoir' },
  SW1A1AA: { lat: 51.501, lng: -0.1416, district: 'Westminster', ward: 'St James’s' },
  E153AB: { lat: 51.5418, lng: -0.0028, district: 'Newham', ward: 'Stratford' },
  N225AA: { lat: 51.5985, lng: -0.1112, district: 'Haringey', ward: 'Noel Park' },
};

const day = (i: number) => {
  const d = new Date(Date.UTC(2026, 9, 5 + i));
  return d.toISOString().slice(0, 10);
};

export async function mockApis(page: Page) {
  // postcodes.io
  await page.route('https://api.postcodes.io/**', (route) => {
    const pc = decodeURIComponent(route.request().url().split('/').pop()!.split('?')[0]!).toUpperCase().replace(/\s/g, '');
    const hit = POSTCODES[pc];
    if (!hit) return route.fulfill({ status: 404, json: { status: 404, error: 'Invalid postcode' } });
    return route.fulfill({ json: { status: 200, result: { postcode: pc.replace(/(\w+)(\d\w\w)$/, '$1 $2'), latitude: hit.lat, longitude: hit.lng, admin_district: hit.district, admin_ward: hit.ward } } });
  });
  // TfL: nearby stations, arrivals and line status
  await page.route('https://api.tfl.gov.uk/**', (route) => {
    const url = route.request().url();
    const soon = (s: number) => new Date(Date.now() + s * 1000).toISOString();
    if (url.includes('/Arrivals'))
      return route.fulfill({
        json: [
          { id: 'a1', lineId: 'central', lineName: 'Central', platformName: 'Westbound', destinationName: 'Ealing Broadway Underground Station', expectedArrival: soon(150), modeName: 'tube' },
          { id: 'a2', lineId: 'central', lineName: 'Central', platformName: 'Eastbound', destinationName: 'Epping Underground Station', expectedArrival: soon(20), modeName: 'tube' },
        ],
      });
    if (url.includes('/Status')) return route.fulfill({ json: [{ id: 'central', name: 'Central', lineStatuses: [{ statusSeverity: 10, statusSeverityDescription: 'Good Service' }] }] });
    return route.fulfill({ json: { stopPoints: [{ naptanId: '940GZZLUBLG', commonName: 'Bethnal Green Underground Station', distance: 640, lat: 51.527, lon: -0.055, modes: ['tube'], lines: [{ id: 'central', name: 'Central' }] }] } });
  });
  // Open-Meteo: a mixed week
  await page.route('https://api.open-meteo.com/**', (route) =>
    route.fulfill({
      json: {
        daily: {
          time: [0, 1, 2, 3, 4, 5, 6].map(day),
          weather_code: [1, 61, 3, 0, 80, 2, 1],
          temperature_2m_max: [18, 14, 16, 21, 12, 7, 17],
          temperature_2m_min: [9, 8, 9, 12, 7, 2, 8],
          precipitation_probability_max: [5, 85, 35, 0, 60, 10, 10],
          precipitation_sum: [0, 6.2, 0.4, 0, 2.1, 0, 0],
          wind_speed_10m_max: [12, 30, 18, 9, 40, 14, 11],
        },
        hourly: { time: [0, 1, 2, 3, 4, 5, 6].flatMap((i) => Array.from({ length: 24 }, (_, h) => `${day(i)}T${String(h).padStart(2, '0')}:00`)), relative_humidity_2m: Array.from({ length: 168 }, () => 70) },
      },
    }),
  );
  // Map: a minimal valid style so MapLibre initialises without tiles
  await page.route('https://tiles.openfreemap.org/**', (route) => route.fulfill({ json: { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#eee' } }] } }));
  // Anything else external: refuse quietly (analytics, fonts are self-hosted)
  await page.route(/^https:\/\/(?!localhost)(?!127\.0\.0\.1).*(googleapis|vimeocdn|player\.vimeo)/, (route) => route.fulfill({ status: 204, body: '' }));
}
