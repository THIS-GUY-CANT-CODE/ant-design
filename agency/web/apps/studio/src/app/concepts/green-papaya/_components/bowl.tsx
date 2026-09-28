'use client';
import { LineArt } from '@sc/ui';

/**
 * Custom line drawing: a bowl of noodles, chopsticks mid-lift, steam rising.
 * The lines draw themselves in; the steam keeps drifting, and puffs harder while "Pick for me" is choosing.
 */
export function Bowl({ busy = false, className }: { busy?: boolean; className?: string }) {
  const steam = ['M150 128 C132 104 166 88 148 62 C132 40 158 26 150 8', 'M190 122 C174 98 206 84 190 58 C176 36 198 20 192 4', 'M112 136 C98 116 124 100 110 80'];
  return (
    <LineArt viewBox="0 0 400 350" className={className} label="Line drawing of a steaming bowl of noodles">
      <g stroke="currentColor" strokeWidth="5">
        {/* rim, bowl and foot */}
        <path data-draw d="M36 168 A164 28 0 0 0 364 168 A164 28 0 0 0 36 168" />
        <path data-draw d="M36 170 C44 262 118 314 200 314 C282 314 356 262 364 170" />
        <path data-draw d="M148 309 L158 334 L242 334 L252 309" />
        {/* chopsticks lifting noodles */}
        <path data-draw d="M318 30 L214 176" />
        <path data-draw d="M350 48 L232 182" />
        <path data-draw d="M226 150 C206 166 238 176 216 196" />
        <path data-draw d="M236 146 C222 170 252 178 236 200" />
        <path data-draw d="M246 150 C238 172 264 180 252 198" />
      </g>
      {/* herbs on the rim, in papaya */}
      <g stroke="var(--accent)" strokeWidth="5">
        <path data-draw d="M72 160 Q92 128 124 146 Q98 172 72 160 Z" />
        <path data-draw d="M78 158 L114 148" />
        <path data-draw d="M300 172 Q328 150 350 170 Q322 186 300 172 Z" />
      </g>
      <g stroke="currentColor" strokeWidth="4" opacity=".75" className={busy ? 'steam steam-busy' : 'steam'}>
        {steam.map((d, i) => (
          <path key={i} d={d} style={{ animationDelay: `${i * -0.9}s` }} />
        ))}
      </g>
    </LineArt>
  );
}
