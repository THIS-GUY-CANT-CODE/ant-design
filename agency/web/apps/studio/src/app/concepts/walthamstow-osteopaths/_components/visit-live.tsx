'use client';
import { Directions, LiveDepartures, MapView, useGeocode } from '@sc/ui';
import { ADDRESS, APPROX, MAP_THEME, POSTCODE } from './site';

export function VisitMap({ className }: { className?: string }) {
  return <MapView label="Map showing Walthamstow Osteopaths at 72 St Mary Road" theme={MAP_THEME} zoom={16} className={className} pins={[{ id: 'no72', label: 'Walthamstow Osteopaths', address: ADDRESS, postcode: POSTCODE, position: APPROX, note: 'No.72, Walthamstow Village' }]} />;
}
export function VisitTrains() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <LiveDepartures lat={pos.lat} lng={pos.lng} />;
}
export function VisitDirections() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <Directions to={pos} name="Walthamstow Osteopaths" address={ADDRESS} />;
}
