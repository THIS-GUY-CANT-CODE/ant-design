'use client';
import { Directions, LiveDepartures, MapView, useGeocode } from '@sc/ui';
import { ADDRESS, APPROX, MAP_THEME, POSTCODE } from './data';

export function VisitMap({ className }: { className?: string }) {
  return (
    <MapView
      label="Map showing Rose Locksmith & DIY on Bethnal Green Road"
      theme={MAP_THEME}
      zoom={16}
      className={className}
      pins={[{ id: 'shop', label: 'Rose Locksmith & DIY', address: ADDRESS, postcode: POSTCODE, position: APPROX, note: 'Mon to Fri 9 to 6, Sat 10 to 5' }]}
    />
  );
}

export function VisitTrains() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <LiveDepartures lat={pos.lat} lng={pos.lng} />;
}

export function VisitDirections() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <Directions to={pos} name="Rose Locksmith & DIY" address={ADDRESS} />;
}
