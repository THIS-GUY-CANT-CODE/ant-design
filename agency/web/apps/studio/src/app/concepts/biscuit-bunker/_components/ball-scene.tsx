'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const CHARTREUSE = '#D7FF3F';

/** The tennis-ball seam: a closed curve on the sphere, x = a·cos t + b·cos 3t, y = a·sin t − b·sin 3t, z = 2√(ab)·sin 2t. */
function useSeam() {
  return useMemo(() => {
    const a = 0.7, b = 0.3, pts: THREE.Vector3[] = [];
    for (let i = 0; i < 240; i++) {
      const t = (i / 240) * Math.PI * 2;
      pts.push(new THREE.Vector3(a * Math.cos(t) + b * Math.cos(3 * t), a * Math.sin(t) - b * Math.sin(3 * t), 2 * Math.sqrt(a * b) * Math.sin(2 * t)).normalize().multiplyScalar(1.003));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, []);
}

/** A small tiling noise texture for the felt nap. */
function useFelt() {
  return useMemo(() => {
    const s = 256, d = new Uint8Array(s * s * 4);
    for (let i = 0; i < s * s; i++) {
      const v = 150 + (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1 * 105; // deterministic hash noise
      d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v;
      d[i * 4 + 3] = 255;
    }
    const t = new THREE.DataTexture(d, s, s);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 6);
    t.needsUpdate = true;
    return t;
  }, []);
}

function Ball({ still }: { still: boolean }) {
  const g = useRef<THREE.Group>(null!);
  const seam = useSeam();
  const felt = useFelt();
  const bounce = useRef({ y: 0, v: 0 });
  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const { pointer, viewport } = state;
    // wide screens: ball sits right of centre so the headline reads cleanly; narrow: centred behind it
    const home = viewport.aspect > 1.2 ? [1.35, 0.35] : [0.2, 0.75];
    const scroll = Math.min(1, window.scrollY / window.innerHeight);
    // spring bounce (click) with gravity-ish damping
    const b = bounce.current;
    b.v += (-b.y * 90 - b.v * 7) * d;
    b.y += b.v * d;
    if (still) g.current.position.set(home[0]!, home[1]!, 0);
    else {
      g.current.rotation.y += d * (0.25 + pointer.x * 0.6);
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.5 + scroll * 3, 0.06);
      g.current.position.x = THREE.MathUtils.lerp(g.current.position.x, home[0]! + pointer.x * 0.3 + scroll * 1.6, 0.06);
      g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, home[1]! + pointer.y * 0.2 - scroll * 2.2, 0.08);
    }
    const squash = 1 - Math.max(-0.12, Math.min(0.12, b.v * 0.01));
    const k = viewport.aspect < 1 ? 0.62 : 1; // smaller on portrait screens
    g.current.scale.set(k / Math.sqrt(squash), k * squash, k / Math.sqrt(squash));
    g.current.children.forEach((c) => (c.position.y = b.y));
  });
  return (
    <group ref={g} onClick={() => (bounce.current.v += 9)}>
      <mesh castShadow>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhysicalMaterial color={CHARTREUSE} roughness={0.9} bumpMap={felt} bumpScale={0.012} sheen={1} sheenRoughness={0.45} sheenColor="#F6FFC2" />
      </mesh>
      <mesh>
        <tubeGeometry args={[seam, 480, 0.016, 10, true]} />
        <meshStandardMaterial color="#F4F3EA" roughness={0.55} />
      </mesh>
    </group>
  );
}

export default function BallScene({ still = false }: { still?: boolean }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6.4], fov: 32 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} frameloop={still ? 'demand' : 'always'}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <Ball still={still} />
      <ContactShadows position={[0.9, -1.35, 0]} opacity={0.55} scale={7} blur={2.6} far={3} color="#000" />
      <Environment resolution={128}>
        <Lightformer intensity={2.4} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer intensity={1.2} position={[-5, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer intensity={0.8} color="#D7FF3F" position={[5, -1, -2]} scale={[3, 3, 1]} />
      </Environment>
    </Canvas>
  );
}
