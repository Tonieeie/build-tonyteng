import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { copy } from "./copy/en";
import { MUSIC_FILE, MUSIC_VOLUME } from "./config";
import { C, FONT, MONO, PAD } from "./theme";

export type Scene = { id: string; len: number; el: React.ReactNode };

/** Total frames of a scene list joined by `t`-frame transitions. */
export const totalFrames = (scenes: readonly Scene[], t: number) =>
  scenes.reduce((a, s) => a + s.len, 0) - t * (scenes.length - 1);

/** Global start frame of a scene, for stills and checks. */
export const startOf = (scenes: readonly Scene[], t: number, id: string) => {
  let f = 0;
  for (const s of scenes) {
    if (s.id === id) return f;
    f += s.len - t;
  }
  throw new Error(id);
};

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        backgroundPosition: "16px 16px",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(195,236,110,0.035), transparent 70%), radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

/** Brand mark. The "by …" suffix is only for the site share card, never the video. */
export const BrandMark: React.FC<{ scale?: number; suffix?: boolean; style?: React.CSSProperties }> = ({ scale = 1, suffix = false, style }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 12 * scale, fontFamily: FONT, ...style }}>
    <span style={{ width: 11 * scale, height: 11 * scale, background: C.accent, borderRadius: 2, alignSelf: "center" }} />
    <span style={{ fontSize: 20 * scale, fontWeight: 600, letterSpacing: "-0.01em", color: C.text }}>{copy.brand.mark}</span>
    {suffix ? <span style={{ fontFamily: MONO, fontSize: 15 * scale, color: C.muted }}>{copy.brand.suffix}</span> : null}
  </div>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 3,
        width: `${(frame / (durationInFrames - 1)) * 100}%`,
        background: C.accent,
        opacity: 0.7,
      }}
    />
  );
};

const Music: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  if (!MUSIC_FILE) return null;
  return (
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) =>
        MUSIC_VOLUME *
        interpolate(f, [0, fps, durationInFrames - fps * 2, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

/** Backdrop + scenes joined by fades + brand mark + progress bar + optional music. */
export const Timeline: React.FC<{ scenes: readonly Scene[]; t: number; children?: React.ReactNode }> = ({ scenes, t, children }) => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Backdrop />
    <TransitionSeries>
      {scenes.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence key={s.id} durationInFrames={s.len}>
            {s.el}
          </TransitionSeries.Sequence>
        );
        return i === scenes.length - 1
          ? [seq]
          : [seq, <TransitionSeries.Transition key={`${s.id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: t })} />];
      })}
    </TransitionSeries>
    <BrandMark style={{ position: "absolute", left: PAD, top: 40 }} />
    <Progress />
    <Music />
    {children}
  </AbsoluteFill>
);
