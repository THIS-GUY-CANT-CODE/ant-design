'use client';
import { OpenNow as Base } from '@sc/ui';
import { HOURS, HOURS_TEXT } from './data';

export function OpenNow() {
  return <Base hours={HOURS} hoursText={HOURS_TEXT} />;
}
