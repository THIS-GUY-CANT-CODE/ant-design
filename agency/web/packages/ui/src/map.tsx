'use client';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { directionsLinks, lookupPostcode, type LngLat } from './geo';

export type MapPin = {
  id: string;
  label: string;
  /** Address line shown in the popup and used for directions. */
  address: string;
  /** Approximate position; refined from `postcode` via postcodes.io when given. */
  position: LngLat;
  postcode?: string;
  note?: string;
  muted?: boolean;
};

export type MapTheme = {
  land: string;
  water: string;
  park: string;
  building: string;
  road: string;
  roadMajor: string;
  label: string;
  halo: string;
  pin: string;
  pinInk: string;
};

// OpenFreeMap: free vector tiles, no key, OpenStreetMap data.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';

type Layer = { id: string; type: string; paint?: Record<string, unknown>; layout?: Record<string, unknown>; 'source-layer'?: string };
type Style = { layers: Layer[] } & Record<string, unknown>;

/** Re-colours the base style into the brand palette and drops clutter (POIs, housenumbers). */
export function tintStyle(style: Style, t: MapTheme): Style {
  const layers = style.layers
    .filter((l) => !/poi|housenumber|aeroway|mountain_peak/i.test(l.id))
    .map((l) => {
      const id = `${l.id} ${l['source-layer'] ?? ''}`.toLowerCase();
      const paint = { ...(l.paint ?? {}) };
      if (l.type === 'background') paint['background-color'] = t.land;
      else if (l.type === 'fill' && /water/.test(id)) paint['fill-color'] = t.water;
      else if (l.type === 'line' && /water|river|canal/.test(id)) paint['line-color'] = t.water;
      else if (l.type === 'fill' && /park|landcover|landuse|wood|grass|cemetery|pitch/.test(id)) {
        paint['fill-color'] = t.park;
        paint['fill-opacity'] = 0.7;
      } else if (l.type === 'fill' && /building/.test(id)) paint['fill-color'] = t.building;
      else if (l.type === 'line' && /rail|transit/.test(id)) paint['line-color'] = t.roadMajor;
      else if (l.type === 'line' && /motorway|trunk|primary|major/.test(id)) paint['line-color'] = t.roadMajor;
      else if (l.type === 'line' && /road|street|highway|minor|secondary|tertiary|bridge|tunnel|path/.test(id)) paint['line-color'] = t.road;
      else if (l.type === 'symbol') {
        paint['text-color'] = t.label;
        paint['text-halo-color'] = t.halo;
      }
      return { ...l, paint };
    });
  return { ...style, layers };
}

type State = 'loading' | 'ready' | 'fallback';

/**
 * A real, interactive map (MapLibre GL + OpenFreeMap tiles) tinted to the brand.
 * Pins are refined from their postcodes, clicking one opens directions, and `selected` flies to it.
 * Without WebGL or if tiles can't load, it falls back to an address card with the same directions links.
 */
export function MapView({ pins, theme, selected, onSelect, zoom = 15, className, label }: { pins: MapPin[]; theme: MapTheme; selected?: string; onSelect?: (id: string) => void; zoom?: number; className?: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<{ fly: (id: string) => void } | null>(null);
  const [state, setState] = useState<State>('loading');
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    let dead = false;
    let destroy = () => {};
    const ctrl = new AbortController();
    (async () => {
      try {
        const test = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl');
        if (!test) throw new Error('no webgl');
        const [ml, styleRes] = await Promise.all([import('maplibre-gl'), fetch(STYLE_URL, { signal: ctrl.signal })]);
        if (!styleRes.ok) throw new Error('style');
        const style = tintStyle((await styleRes.json()) as Style, theme);
        if (dead) return;
        ml.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const first = pins[0]!.position;
        const map = new ml.Map({
          container: box.current!,
          style: style as never,
          center: [first.lng, first.lat],
          zoom,
          attributionControl: { compact: true },
          cooperativeGestures: true,
        });
        map.addControl(new ml.NavigationControl({ showCompass: false }), 'top-right');
        const markers = new Map<string, InstanceType<typeof ml.Marker>>();
        const positions = new Map(pins.map((p) => [p.id, p.position]));
        for (const p of pins) {
          const el = document.createElement('button');
          el.type = 'button';
          el.className = 'sc-pin';
          el.setAttribute('aria-label', `${p.label}, ${p.address}`);
          el.style.setProperty('--pin', p.muted ? theme.label : theme.pin);
          el.style.setProperty('--pin-ink', theme.pinInk);
          el.innerHTML = `<span></span>`;
          const d = directionsLinks(p.position, p.label, p.address);
          const popup = new ml.Popup({ offset: 22, closeButton: false, maxWidth: '260px' }).setHTML(
            `<div class="sc-pop"><b>${esc(p.label)}</b><span>${esc(p.address)}</span>${p.note ? `<em>${esc(p.note)}</em>` : ''}<a href="${d.google}" target="_blank" rel="noopener">Directions ↗</a></div>`,
          );
          const m = new ml.Marker({ element: el, anchor: 'bottom' }).setLngLat([p.position.lng, p.position.lat]).setPopup(popup).addTo(map);
          el.addEventListener('click', () => onSelectRef.current?.(p.id));
          markers.set(p.id, m);
          // refine to the postcode centroid
          if (p.postcode)
            lookupPostcode(p.postcode, ctrl.signal)
              .then((pl) => {
                m.setLngLat([pl.lng, pl.lat]);
                positions.set(p.id, pl);
                if (pins.length === 1) map.jumpTo({ center: [pl.lng, pl.lat] });
              })
              .catch(() => {});
        }
        if (pins.length > 1) {
          const b = new ml.LngLatBounds();
          pins.forEach((p) => b.extend([p.position.lng, p.position.lat]));
          map.fitBounds(b, { padding: 60, duration: 0, maxZoom: zoom });
        }
        api.current = {
          fly: (id) => {
            const pos = positions.get(id);
            if (!pos) return;
            const opts = { center: [pos.lng, pos.lat] as [number, number], zoom: Math.max(map.getZoom(), 13) };
            if (reduce) map.jumpTo(opts);
            else map.flyTo({ ...opts, speed: 1.4 });
            markers.forEach((mk, k) => mk.getElement().classList.toggle('is-on', k === id));
          },
        };
        map.on('load', () => !dead && setState('ready'));
        destroy = () => map.remove();
      } catch {
        if (!dead) setState('fallback');
      }
    })();
    return () => {
      dead = true;
      ctrl.abort();
      destroy();
    };
    // the map is built once per mount; pins and theme are static per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selected) api.current?.fly(selected);
  }, [selected, state]);

  const main = pins[0]!;
  const d = directionsLinks(main.position, main.label, main.address);
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={{ background: theme.land }}>
      <div ref={box} className="absolute inset-0" role="region" aria-label={label} />
      {state === 'loading' && <div className="pointer-events-none absolute inset-0 animate-pulse" style={{ background: theme.park, opacity: 0.35 }} />}
      {state === 'fallback' && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center" style={{ color: theme.label }}>
          <div>
            <p className="text-[15px] opacity-70">The map couldn&apos;t load here.</p>
            <p className="mt-2 text-[18px] font-semibold">{main.address}</p>
            <p className="mt-4 flex flex-wrap justify-center gap-3 text-[14px] underline underline-offset-4">
              <a href={d.google} target="_blank" rel="noopener">Google Maps</a>
              <a href={d.apple} target="_blank" rel="noopener">Apple Maps</a>
              <a href={d.citymapper} target="_blank" rel="noopener">Citymapper</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Google, Apple and Citymapper directions as a row of buttons. */
export function Directions({ to, name, address, className, itemClassName }: { to: LngLat; name: string; address: string; className?: string; itemClassName?: string }) {
  const d = directionsLinks(to, name, address);
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {(
        [
          ['Google Maps', d.google],
          ['Apple Maps', d.apple],
          ['Citymapper', d.citymapper],
        ] as const
      ).map(([l, h]) => (
        <a key={l} href={h} target="_blank" rel="noopener" className={itemClassName ?? 'rounded-full border border-current/20 px-4 py-2 text-[14px] transition-colors hover:bg-fg hover:text-bg'}>
          {l} ↗
        </a>
      ))}
    </div>
  );
}
