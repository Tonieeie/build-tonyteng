import React, { useLayoutEffect, useMemo, useRef } from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// A glazed ceramic mug, built from primitives so it needs no model files.
// Everything is driven by the Remotion frame (scene-local), so it renders deterministically.

export type MugTiming = {
  appear: number;
  push: [number, number];
  pull: [number, number];
  pour: [number, number]; // stream on → stream off
  fill: [number, number]; // liquid level rises
  steam: number;
};

const CLAY = "#A4553A";
const CREAM = "#F1E8DA";
const COCOA = "#4A2A1C";
const BG = "#E9DCCB";

const R_TOP = 1.0;
const R_BOT = 0.9;
const H = 1.9;
const IN_TOP = 0.93;
const IN_BOT = 0.84;
const FLOOR = -H / 2 + 0.07;
const MAX_LEVEL = 1.5;

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

/** Terracotta body with a cream glaze that drips down from the rim. */
function useDripTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = CLAY;
    g.fillRect(0, 0, c.width, c.height);
    // subtle throwing lines
    for (let y = 0; y < c.height; y += 6) {
      g.fillStyle = `rgba(0,0,0,${0.02 + 0.03 * random(`l${y}`)})`;
      g.fillRect(0, y, c.width, 2);
    }
    const drips = Array.from({ length: 9 }, (_, i) => ({ x: ((i + 0.5) / 9 + (random(`dx${i}`) - 0.5) * 0.06) * c.width, len: 25 + random(`dl${i}`) * 70, w: 9 + random(`dw${i}`) * 12 }));
    g.fillStyle = CREAM;
    g.beginPath();
    g.moveTo(0, 0);
    for (let x = 0; x <= c.width; x += 4) {
      let y = 92 + 8 * Math.sin(x / 37) + 5 * Math.sin(x / 13);
      for (const d of drips) {
        const dx = (x - d.x) / d.w;
        y += d.len * Math.exp(-dx * dx);
      }
      g.lineTo(x, y);
    }
    g.lineTo(c.width, 0);
    g.closePath();
    g.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function useSoftDot(color: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [color]);
}

const Environment: React.FC = () => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

const CameraRig: React.FC<{ t: MugTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const push = ease(frame, t.push[0], t.push[1]) * (1 - ease(frame, t.pull[0], t.pull[1]));
  // Slow orbit the whole time; the push lifts the camera to look down into the cup.
  const angle = -0.7 + frame * 0.028;
  const radius = interpolate(push, [0, 1], [6.4, 5.0]);
  const y = interpolate(push, [0, 1], [1.5, 3.1]);
  const lookY = interpolate(push, [0, 1], [0.05, 0.35]);
  useLayoutEffect(() => {
    camera.position.set(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
    camera.lookAt(0, lookY, 0);
    camera.updateProjectionMatrix();
  }, [camera, angle, radius, y, lookY]);
  return null;
};

const Steam: React.FC<{ t: MugTiming; top: number }> = ({ t, top }) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const tex = useSoftDot("rgba(255,255,255,0.9)");
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const on = ease(frame, t.steam, t.steam + 12);
  useLayoutEffect(() => {
    refs.current.forEach((m) => m && m.quaternion.copy(camera.quaternion));
  });
  if (on <= 0) return null;
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const period = 34;
        const q = (((frame - t.steam + i * (period / 7)) % period) + period) % period / period;
        const y = top + 0.15 + q * 1.9;
        const x = Math.sin(q * 5 + i) * 0.22 + (random(`sx${i}`) - 0.5) * 0.4;
        const z = (random(`sz${i}`) - 0.5) * 0.4;
        const s = 0.5 + q * 1.1;
        const o = Math.sin(q * Math.PI) * 0.32 * on;
        return (
          <mesh key={i} ref={(m) => (refs.current[i] = m)} position={[x, y, z]} scale={[s, s * 1.3, s]} renderOrder={10}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={tex} transparent opacity={o} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

const Mug: React.FC<{ t: MugTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const drip = useDripTexture();
  const shadow = useSoftDot("rgba(60,35,20,0.55)");

  const level = MAX_LEVEL * ease(frame, t.fill[0], t.fill[1]);
  const liquidTop = FLOOR + level;
  const rAt = (lvl: number) => IN_BOT + (IN_TOP - IN_BOT) * ((lvl + 0.07) / H);

  // Stream: bottom end falls from above to the surface, then the top end follows it down.
  const STREAM_TOP = 6;
  const fallIn = ease(frame, t.pour[0], t.pour[0] + 4);
  const cutOff = ease(frame, t.pour[1], t.pour[1] + 6);
  const streamBottom = interpolate(fallIn, [0, 1], [STREAM_TOP, Math.max(liquidTop, FLOOR)]);
  const streamTopY = interpolate(cutOff, [0, 1], [STREAM_TOP, Math.max(liquidTop, FLOOR)]);
  const streamLen = Math.max(0, streamTopY - streamBottom);
  const pouring = frame >= t.pour[0] && streamLen > 0.01;
  const wobble = Math.sin(frame * 1.7) * 0.01;

  // Ripple ring on the surface while pouring.
  const rippleQ = ((frame - t.pour[0]) % 10) / 10;
  const appear = ease(frame, t.appear, t.appear + 10);

  return (
    <group scale={0.4 + 0.6 * appear} rotation={[0, (1 - appear) * -1.2, 0]}>
      {/* body */}
      <mesh castShadow>
        <cylinderGeometry args={[R_TOP, R_BOT, H, 96, 1, true]} />
        <meshPhysicalMaterial map={drip} roughness={0.35} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={0.55} side={THREE.FrontSide} />
      </mesh>
      {/* inside glaze */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[IN_TOP, IN_BOT, H - 0.04, 96, 1, true]} />
        <meshPhysicalMaterial color={CREAM} roughness={0.25} clearcoat={1} side={THREE.BackSide} />
      </mesh>
      {/* rim */}
      <mesh position={[0, H / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[(R_TOP + IN_TOP) / 2, (R_TOP - IN_TOP) / 2 + 0.005, 16, 96]} />
        <meshPhysicalMaterial color={CREAM} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* floors */}
      <mesh position={[0, FLOOR, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[IN_BOT, 64]} />
        <meshPhysicalMaterial color={CREAM} roughness={0.3} />
      </mesh>
      <mesh position={[0, -H / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R_BOT, 64]} />
        <meshStandardMaterial color="#8E4C35" roughness={0.8} />
      </mesh>
      {/* handle */}
      <mesh position={[R_TOP - 0.06, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 1.15, 1]}>
        <torusGeometry args={[0.46, 0.11, 24, 64, Math.PI]} />
        <meshPhysicalMaterial color={CLAY} roughness={0.35} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={0.55} />
      </mesh>

      {/* hot chocolate */}
      {level > 0.01 ? (
        <>
          <mesh position={[0, FLOOR + level / 2, 0]}>
            <cylinderGeometry args={[rAt(level), IN_BOT, level, 64, 1, true]} />
            <meshPhysicalMaterial color={COCOA} roughness={0.15} clearcoat={1} side={THREE.BackSide} />
          </mesh>
          <mesh position={[0, liquidTop + wobble, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[rAt(level) - 0.005, 64]} />
            <meshPhysicalMaterial color="#5A3322" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
          {pouring ? (
            <mesh position={[0, liquidTop + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08 + rippleQ * 0.55, 0.11 + rippleQ * 0.55, 48]} />
              <meshBasicMaterial color="#8B5A40" transparent opacity={0.6 * (1 - rippleQ)} />
            </mesh>
          ) : null}
        </>
      ) : null}

      {/* stream */}
      {pouring ? (
        <mesh position={[0.02, streamBottom + streamLen / 2, 0]}>
          <cylinderGeometry args={[0.07, 0.085, streamLen, 16, 1]} />
          <meshPhysicalMaterial color="#5A3322" roughness={0.1} clearcoat={1} />
        </mesh>
      ) : null}

      {/* contact shadow */}
      <mesh position={[0, -H / 2 - 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={appear} />
      </mesh>

      <Steam t={t} top={liquidTop} />
    </group>
  );
};

export const Mug3D: React.FC<{ width: number; height: number; timing: MugTiming }> = ({ width, height, timing }) => (
  <ThreeCanvas width={width} height={height} camera={{ fov: 30, near: 0.1, far: 100, position: [0, 1.5, 6.4] }} gl={{ antialias: true }}>
    <color attach="background" args={[BG]} />
    <Environment />
    <ambientLight intensity={0.15} />
    <hemisphereLight args={["#fff6ea", "#c9a88a", 0.35]} />
    <directionalLight position={[3.5, 5, 4]} intensity={1.5} color="#fff4e6" />
    <directionalLight position={[-4, 2.5, -3]} intensity={0.9} color="#ffd9b0" />
    <CameraRig t={timing} />
    <group position={[0, -0.15, 0]}>
      <Mug t={timing} />
    </group>
  </ThreeCanvas>
);
