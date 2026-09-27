import { Easing, interpolate, spring } from "remotion";
import { FPS } from "../theme";

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 spring that starts at `delay` frames. */
export const enter = (frame: number, delay = 0, damping = 200, durationInFrames?: number) =>
  spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping, mass: 0.8, stiffness: 120 },
    durationInFrames,
  });

/** Clamped linear-ish ramp between two frames, eased. */
export const ramp = (frame: number, from: number, to: number, outFrom = 0, outTo = 1) =>
  interpolate(frame, [from, to], [outFrom, outTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Number of characters visible for a typewriter starting at `start`. */
export const typed = (frame: number, text: string, start: number, charsPerFrame = 1.4) =>
  Math.max(0, Math.min(text.length, Math.floor((frame - start) * charsPerFrame)));

/** Frame at which a typewriter of `text` finishes. */
export const typedEnd = (text: string, start: number, charsPerFrame = 1.4) =>
  start + Math.ceil(text.length / charsPerFrame);

export type Key = { f: number; x: number; y: number };

/** Interpolate a 2D point along keyframes, eased between each pair. */
export const path = (frame: number, keys: Key[]) => {
  if (frame <= keys[0].f) return { x: keys[0].x, y: keys[0].y };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], { easing: Easing.bezier(0.45, 0, 0.2, 1) });
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y };
};
