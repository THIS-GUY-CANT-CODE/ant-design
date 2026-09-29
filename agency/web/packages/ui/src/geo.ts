/** Geo helpers backed by postcodes.io (free, no key, CORS enabled). */

export type LngLat = { lng: number; lat: number };
export type Place = LngLat & { postcode: string; district: string; ward: string };

const clean = (pc: string) => pc.trim().toUpperCase().replace(/\s+/g, '');
/** Full UK postcode, e.g. "E2 7DG". */
export const isPostcode = (pc: string) => /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(clean(pc));
/** Outward code only, e.g. "E2" or "EC2A". */
export const isOutcode = (pc: string) => /^[A-Z]{1,2}\d[A-Z\d]?$/.test(clean(pc));

type PostcodeResult = { postcode: string; longitude: number | null; latitude: number | null; admin_district: string | null; admin_ward: string | null };
type OutcodeResult = { outcode: string; longitude: number | null; latitude: number | null; admin_district: string[] | null };

/** Looks up a full postcode or an outward code. Throws with a readable message if it can't. */
export async function lookupPostcode(input: string, signal?: AbortSignal): Promise<Place> {
  const pc = clean(input);
  if (isPostcode(pc)) {
    const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`, { signal });
    if (r.status === 404) throw new Error(`We couldn't find ${input.toUpperCase()}. Check it and try again.`);
    if (!r.ok) throw new Error('The postcode service is busy. Please try again in a moment.');
    const { result } = (await r.json()) as { result: PostcodeResult };
    if (result.latitude == null || result.longitude == null) throw new Error(`${result.postcode} has no location on record.`);
    return { postcode: result.postcode, lat: result.latitude, lng: result.longitude, district: result.admin_district ?? '', ward: result.admin_ward ?? '' };
  }
  if (isOutcode(pc)) {
    const r = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(pc)}`, { signal });
    if (r.status === 404) throw new Error(`We couldn't find ${input.toUpperCase()}.`);
    if (!r.ok) throw new Error('The postcode service is busy. Please try again in a moment.');
    const { result } = (await r.json()) as { result: OutcodeResult };
    if (result.latitude == null || result.longitude == null) throw new Error(`${result.outcode} has no location on record.`);
    return { postcode: result.outcode, lat: result.latitude, lng: result.longitude, district: result.admin_district?.[0] ?? '', ward: '' };
  }
  throw new Error('That doesn’t look like a UK postcode. Try something like E2 7DG.');
}

/** Great-circle distance in kilometres. */
export function distanceKm(a: LngLat, b: LngLat) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export const kmToMiles = (km: number) => km * 0.621371;
/** "0.4 miles" / "12 miles" */
export const formatMiles = (km: number) => {
  const m = kmToMiles(km);
  return `${m < 10 ? m.toFixed(1) : Math.round(m)} ${m >= 0.95 && m < 1.05 ? 'mile' : 'miles'}`;
};
/** Walking time at a steady 5 km/h, rounded to the minute. */
export const walkMinutes = (km: number) => Math.max(1, Math.round((km / 5) * 60));

/** Deep links for turn-by-turn directions. Destination is a lat/lng plus a readable name. */
export function directionsLinks(to: LngLat, name: string, address: string) {
  const ll = `${to.lat},${to.lng}`;
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${name}, ${address}`)}`,
    apple: `https://maps.apple.com/?daddr=${encodeURIComponent(address)}&q=${encodeURIComponent(name)}&ll=${ll}`,
    citymapper: `https://citymapper.com/directions?endcoord=${encodeURIComponent(ll)}&endname=${encodeURIComponent(name)}&endaddress=${encodeURIComponent(address)}`,
  };
}
