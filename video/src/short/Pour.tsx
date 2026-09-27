import React, { useLayoutEffect, useMemo } from "react";
import { random, useCurrentFrame } from "remotion";
import * as THREE from "three";

// Hot chocolate for the 3D mug: an arcing stream that thins as it falls,
// a rippling glossy surface, a crema meniscus, drifting foam and splash droplets.
// Everything is a pure function of the frame, so renders are deterministic.

export type PourTiming = { pour: [number, number]; fill: [number, number] };

const BODY = "#3A1F15";
const SURFACE = "#4A2819";
const STREAM = "#5B311E";
const CREMA = "#8C5B3F";
const FOAM = "#A57553";

// Stream leaves a spout up and to the side (out of frame), then falls onto the surface.
const SPOUT = { x: -1.7, y: 2.85, z: 0.45 };
const IMPACT = { x: 0.14, z: 0.06 };
const R_SPOUT = 0.14;
const FLOW_FRAMES = 5; // time for liquid to travel spout → surface

const SEG = 96;
const RAD = 24;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Centre of the stream at path time τ ∈ [0,1]: horizontal launch, then free fall. */
const centre = (tau: number, impactY: number) => ({
  x: SPOUT.x + (IMPACT.x - SPOUT.x) * tau,
  y: SPOUT.y - (SPOUT.y - impactY) * tau * tau,
  z: SPOUT.z + (IMPACT.z - SPOUT.z) * tau,
});

/** Mass conservation: the stream speeds up as it falls, so it gets thinner (r ∝ 1/√v). */
const baseRadius = (tau: number, impactY: number) => {
  const dx = Math.hypot(IMPACT.x - SPOUT.x, IMPACT.z - SPOUT.z);
  const dy = SPOUT.y - impactY;
  const v = Math.hypot(dx, 2 * dy * tau);
  return R_SPOUT * Math.sqrt(dx / v);
};

const PourStream: React.FC<{ t: PourTiming; impactY: number }> = ({ t, impactY }) => {
  const frame = useCurrentFrame();
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((SEG + 1) * RAD * 3), 3));
    const idx: number[] = [];
    for (let i = 0; i < SEG; i++) {
      for (let j = 0; j < RAD; j++) {
        const a = i * RAD + j;
        const b = i * RAD + ((j + 1) % RAD);
        const c = (i + 1) * RAD + j;
        const d = (i + 1) * RAD + ((j + 1) % RAD);
        idx.push(a, c, b, b, c, d);
      }
    }
    g.setIndex(idx);
    return g;
  }, []);

  // Head travels down when the pour starts; the tail follows when it stops.
  const head = Math.min(1, Math.max(0, (frame - t.pour[0]) / FLOW_FRAMES));
  const tail = Math.min(1, Math.max(0, (frame - t.pour[1]) / FLOW_FRAMES));
  const visible = frame >= t.pour[0] && tail < 1 && head > tail + 0.01;

  useLayoutEffect(() => {
    if (!visible) return;
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    const T = new THREE.Vector3();
    const N1 = new THREE.Vector3();
    const N2 = new THREE.Vector3();
    const Z = new THREE.Vector3(0, 0, 1);
    const cap = 0.05;
    for (let i = 0; i <= SEG; i++) {
      const tau = tail + (head - tail) * (i / SEG);
      const c = centre(tau, impactY);
      const c2 = centre(Math.min(1, tau + 0.002), impactY);
      const c1 = centre(Math.max(0, tau - 0.002), impactY);
      T.set(c2.x - c1.x, c2.y - c1.y, c2.z - c1.z).normalize();
      N1.crossVectors(T, Z).normalize();
      N2.crossVectors(T, N1).normalize();
      // Rounded drop at the falling head, a thinning thread at the tail.
      let r = baseRadius(tau, impactY);
      if (head < 1 && tau > head - cap) r *= Math.sqrt(Math.max(0, 1 - ((tau - (head - cap)) / cap) ** 2)) * 1.15;
      if (tail > 0 && tau < tail + cap * 2) r *= Math.pow(Math.max(0, (tau - tail) / (cap * 2)), 0.6);
      // Lateral sway of the whole stream.
      const sway = 0.006 * Math.sin(tau * 14 - frame * 0.7);
      for (let j = 0; j < RAD; j++) {
        const th = (j / RAD) * Math.PI * 2;
        // Ripples travelling down the stream (phase moves with the frame).
        const ripple = 1 + 0.035 * Math.sin(tau * 38 - frame * 1.3 + th * 2) + 0.018 * Math.sin(tau * 83 - frame * 2.1 + th * 3);
        const rr = r * ripple;
        const k = (i * RAD + j) * 3;
        pos.array[k] = c.x + N1.x * (Math.cos(th) * rr + sway) + N2.x * Math.sin(th) * rr;
        pos.array[k + 1] = c.y + N1.y * (Math.cos(th) * rr + sway) + N2.y * Math.sin(th) * rr;
        pos.array[k + 2] = c.z + N1.z * (Math.cos(th) * rr + sway) + N2.z * Math.sin(th) * rr;
      }
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
  });

  if (!visible) return null;
  return (
    <mesh geometry={geom}>
      <meshPhysicalMaterial color={STREAM} roughness={0.07} clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={1.3} />
    </mesh>
  );
};

/** Surface with ripples spreading from the impact point and a dimple under the stream. */
const Surface: React.FC<{ t: PourTiming; top: number; radius: number }> = ({ t, top, radius }) => {
  const frame = useCurrentFrame();
  const geom = useMemo(() => new THREE.RingGeometry(0.0001, 1, 96, 36), []);
  const base = useMemo(() => Float32Array.from((geom.getAttribute("position") as THREE.BufferAttribute).array), [geom]);

  const landed = frame >= t.pour[0] + FLOW_FRAMES;
  const on = landed ? smooth(t.pour[0] + FLOW_FRAMES, t.pour[0] + FLOW_FRAMES + 3, frame) : 0;
  const decay = frame > t.pour[1] + FLOW_FRAMES ? Math.exp(-(frame - t.pour[1] - FLOW_FRAMES) / 9) : 1;
  const amp = 0.028 * on * decay;
  const dimple = frame < t.pour[1] + FLOW_FRAMES ? on : 0;
  // Impact point in the ring's local (unit) space: world (x, z) → local (x, -z).
  const ix = IMPACT.x / radius;
  const iy = -IMPACT.z / radius;

  useLayoutEffect(() => {
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    for (let v = 0; v < pos.count; v++) {
      const x = base[v * 3];
      const y = base[v * 3 + 1];
      const d = Math.hypot(x - ix, y - iy) * radius;
      const edge = 1 - smooth(0.82, 1.0, Math.hypot(x, y));
      let z = amp * Math.sin(d * 16 - frame * 1.15) * Math.exp(-d * 1.4) * edge;
      z -= 0.06 * dimple * Math.exp(-((d / 0.13) ** 2));
      z += 0.02 * dimple * Math.exp(-(((d - 0.2) / 0.08) ** 2));
      pos.array[v * 3 + 2] = z / radius; // mesh is scaled by radius, keep heights in world units
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh geometry={geom} position={[0, top, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[radius, radius, radius]}>
      <meshPhysicalMaterial color={SURFACE} roughness={0.06} clearcoat={1} clearcoatRoughness={0.02} envMapIntensity={1.2} />
    </mesh>
  );
};

/** Little bubbles drifting in a slow swirl, stirred up by the pour. */
const Foam: React.FC<{ t: PourTiming; top: number; radius: number }> = ({ t, top, radius }) => {
  const frame = useCurrentFrame();
  const fade = smooth(t.fill[0] + 6, t.fill[0] + 14, frame);
  if (fade <= 0) return null;
  // Swirl speed: quick during the pour, easing off afterwards.
  const swirl = (f: number) => (f < t.pour[1] ? f * 0.05 : t.pour[1] * 0.05 + (1 - Math.exp(-(f - t.pour[1]) / 25)) * 1.2);
  const a0 = swirl(frame);
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const rho = radius * (0.3 + 0.62 * random(`fr${i}`));
        const th = random(`ft${i}`) * Math.PI * 2 + a0 * (1.2 - rho / radius);
        const size = 0.012 + 0.026 * random(`fs${i}`);
        return (
          <mesh key={i} position={[Math.cos(th) * rho, top + 0.006, Math.sin(th) * rho]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[size, 16]} />
            <meshStandardMaterial color={FOAM} roughness={0.5} transparent opacity={0.85 * fade} />
          </mesh>
        );
      })}
    </>
  );
};

/** Droplets thrown up where the stream hits. */
const Splash: React.FC<{ t: PourTiming; top: number }> = ({ t, top }) => {
  const frame = useCurrentFrame();
  const start = t.pour[0] + FLOW_FRAMES;
  const end = t.pour[1] + FLOW_FRAMES;
  if (frame < start || frame > end + 10) return null;
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const period = 8 + Math.floor(random(`sp${i}`) * 4);
        const born = start + i * 0.9;
        const age = ((frame - born) % period + period) % period;
        const launch = frame - age;
        if (launch < start || launch > end) return null;
        const vx = (random(`vx${i}-${launch}`) - 0.5) * 0.07;
        const vz = (random(`vz${i}-${launch}`) - 0.5) * 0.07;
        const vy = 0.07 + random(`vy${i}-${launch}`) * 0.05;
        const y = top + vy * age - 0.5 * 0.024 * age * age;
        if (y < top) return null;
        const r = 0.018 + 0.022 * random(`r${i}`);
        return (
          <mesh key={i} position={[IMPACT.x + vx * age, y, IMPACT.z + vz * age]}>
            <sphereGeometry args={[r, 12, 10]} />
            <meshPhysicalMaterial color={STREAM} roughness={0.08} clearcoat={1} envMapIntensity={1.2} />
          </mesh>
        );
      })}
    </>
  );
};

/** Liquid body + surface + meniscus + foam + stream + splash. */
export const HotChocolate: React.FC<{
  t: PourTiming;
  level: number;
  floor: number;
  radiusAt: (level: number) => number;
  bottomRadius: number;
}> = ({ t, level, floor, radiusAt, bottomRadius }) => {
  const top = floor + level;
  const r = radiusAt(level) - 0.004;
  return (
    <>
      {level > 0.01 ? (
        <>
          <mesh position={[0, floor + level / 2, 0]}>
            <cylinderGeometry args={[r, bottomRadius, level, 64, 1, true]} />
            <meshPhysicalMaterial color={BODY} roughness={0.2} clearcoat={1} side={THREE.BackSide} />
          </mesh>
          <Surface t={t} top={top} radius={r} />
          {/* crema meniscus where the liquid meets the glaze */}
          <mesh position={[0, top + 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r - 0.012, 0.016, 10, 96]} />
            <meshStandardMaterial color={CREMA} roughness={0.45} />
          </mesh>
          <Foam t={t} top={top} radius={r} />
        </>
      ) : null}
      <PourStream t={t} impactY={Math.max(top, floor)} />
      <Splash t={t} top={Math.max(top, floor)} />
    </>
  );
};
