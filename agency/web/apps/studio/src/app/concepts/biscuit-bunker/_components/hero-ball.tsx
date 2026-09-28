'use client';
import dynamic from 'next/dynamic';
import { useReducedMotion } from '@sc/ui';

// WebGL only runs in the browser; the server renders an empty stage.
const BallScene = dynamic(() => import('./ball-scene'), { ssr: false });

export function HeroBall() {
  const still = useReducedMotion();
  return (
    <div className="absolute inset-0" data-cursor="Fetch">
      <BallScene still={still} />
    </div>
  );
}
