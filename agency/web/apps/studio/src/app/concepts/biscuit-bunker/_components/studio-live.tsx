'use client';
import { Directions, LiveDepartures, MapView, useGeocode } from '@sc/ui';
import { ADDRESS, APPROX, MAP_THEME, POSTCODE } from './site';

export function StudioMap({ className }: { className?: string }) {
  return <MapView label="Map showing the Biscuit Bunker studio in Shoreditch" theme={MAP_THEME} zoom={15} className={className} pins={[{ id: 'bb', label: 'Biscuit Bunker', address: ADDRESS, postcode: POSTCODE, position: APPROX, note: 'By appointment' }]} />;
}
export function StudioTrains() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <LiveDepartures lat={pos.lat} lng={pos.lng} maxStops={3} />;
}
export function StudioDirections() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <Directions to={pos} name="Biscuit Bunker" address={ADDRESS} itemClassName="rounded-full border border-line px-4 py-2 text-[14px] transition-colors hover:bg-accent hover:text-accent-ink" />;
}
