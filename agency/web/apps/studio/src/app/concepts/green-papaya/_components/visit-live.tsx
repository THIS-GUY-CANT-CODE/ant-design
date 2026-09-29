'use client';
import { Directions, LiveDepartures, MapView, OpenNow, useGeocode } from '@sc/ui';
import { HOURS, HOURS_TEXT } from './hours';
import { ADDRESS, APPROX, MAP_THEME, POSTCODE } from './site';

export function VisitMap({ className }: { className?: string }) {
  return <MapView label="Map showing Green Papaya on Mare Street" theme={MAP_THEME} zoom={16} className={className} pins={[{ id: 'gp', label: 'Green Papaya', address: ADDRESS, postcode: POSTCODE, position: APPROX, note: 'Closed Mondays' }]} />;
}
export function VisitTrains() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <LiveDepartures lat={pos.lat} lng={pos.lng} />;
}
export function VisitDirections() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <Directions to={pos} name="Green Papaya" address={ADDRESS} />;
}
export function Hours() {
  return <OpenNow hours={HOURS} hoursText={HOURS_TEXT} />;
}
