'use client';
import { useEffect, useState } from 'react';
import { lookupPostcode, type LngLat } from './geo';

/** Position of a postcode (postcodes.io), starting from an approximate fallback until it resolves. */
export function useGeocode(postcode: string, fallback: LngLat) {
  const [pos, setPos] = useState<LngLat>(fallback);
  useEffect(() => {
    const ctrl = new AbortController();
    lookupPostcode(postcode, ctrl.signal)
      .then((p) => setPos({ lat: p.lat, lng: p.lng }))
      .catch(() => {});
    return () => ctrl.abort();
  }, [postcode]);
  return pos;
}
