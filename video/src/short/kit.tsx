import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { C, FONT, FPS, MONO, PAD } from "../theme";
import { enter } from "../ui/anim";
import { AgentGlyph } from "../ui/icons";

/** Bouncy 0→1 (overshoots), for pops and slams. */
export const pop = (frame: number, delay: number, damping = 11) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping, stiffness: 170, mass: 0.7 } });

/** Big punchy scene title: mono label + words that pop in with overshoot. */
export const KineticTitle: React.FC<{ index?: string; label: string; title: string; size?: number; top?: number }> = ({
  index,
  label,
  title,
  size = 84,
  top = 92,
}) => {
  const frame = useCurrentFrame();
  const lp = enter(frame, 0);
  return (
    <div style={{ position: "absolute", left: PAD, top, fontFamily: FONT }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: MONO,
          fontSize: 20,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: C.muted,
          opacity: lp,
          transform: `translateX(${(1 - lp) * -20}px)`,
        }}
      >
        {index ? <span style={{ color: C.accent }}>{index}</span> : null}
        {index ? <span style={{ width: 28, height: 1, background: C.lineHi }} /> : null}
        {label}
      </div>
      <div style={{ marginTop: 16, fontSize: size, lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.045em", whiteSpace: "nowrap", color: C.text }}>
        {title.split(" ").map((w, i) => {
          const p = pop(frame, 3 + i * 2.5);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.22em",
                opacity: Math.min(1, p * 1.6),
                transform: `translateY(${(1 - p) * 50}px) scale(${0.7 + 0.3 * p}) rotate(${(1 - p) * -6}deg)`,
                transformOrigin: "left bottom",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Plain-English narration along the bottom: three numbered steps that light up as they happen.
 * `at[i]` is when step i becomes active; a step is done once the next one starts (the last at `doneAt`).
 */
export const StepsBar: React.FC<{ steps: readonly string[]; at: number[]; doneAt: number }> = ({ steps, at, doneAt }) => {
  const frame = useCurrentFrame();
  const GAP = 64;
  const w = (1728 - GAP * (steps.length - 1)) / steps.length;
  const intro = enter(frame, 0);
  return (
    <div style={{ position: "absolute", left: PAD, top: 902, display: "flex", alignItems: "stretch", gap: GAP, opacity: intro, fontFamily: FONT }}>
      {steps.map((st, i) => {
        const start = at[i];
        const end = i < steps.length - 1 ? at[i + 1] : doneAt;
        const active = frame >= start && frame < end;
        const done = frame >= end;
        const p = pop(frame, start, 12);
        const fill = Math.max(0, Math.min(1, (frame - start) / Math.max(1, end - start)));
        return (
          <div key={st} style={{ position: "relative", width: w }}>
            <div
              style={{
                position: "relative",
                height: 104,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 24px",
                borderRadius: 20,
                overflow: "hidden",
                background: active ? "#1C2216" : C.panel,
                border: `2px solid ${active ? C.accent : done ? "rgba(195,236,110,0.35)" : C.line}`,
                opacity: frame < start ? 0.4 : 1,
                transform: `scale(${active ? 1 + 0.03 * Math.sin(Math.min(1, p) * Math.PI) : 1})`,
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontSize: 22,
                  fontWeight: 500,
                  background: active || done ? C.accent : "transparent",
                  color: active || done ? C.ink : C.muted,
                  border: active || done ? "none" : `1.5px solid ${C.lineHi}`,
                }}
              >
                {done ? "✓" : i + 1}
              </span>
              <span style={{ fontSize: 28, lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.01em", textWrap: "balance", color: active ? C.text : done ? C.sub : C.muted }}>
                {st}
              </span>
              {active ? <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${fill * 100}%`, background: C.accent }} /> : null}
            </div>
            {i < steps.length - 1 ? (
              <svg width={GAP} height={104} viewBox={`0 0 ${GAP} 104`} style={{ position: "absolute", right: -GAP, top: 0 }}>
                <path d={`M16 52 H${GAP - 16} M${GAP - 26} 42 L${GAP - 16} 52 L${GAP - 26} 62`} stroke={done ? C.accent : C.faint} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** The recurring "AI helper" character: a lime pill that travels to where the work happens. */
export const HelperBadge: React.FC<{ x: number; y: number; label: string; show?: number; working?: boolean }> = ({ x, y, label, show = 1, working }) => {
  const frame = useCurrentFrame();
  const pulse = (Math.sin(frame / 3) + 1) / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * show})`,
        opacity: Math.min(1, show * 1.4),
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 54,
        padding: "0 22px 0 14px",
        borderRadius: 27,
        background: C.accent,
        color: C.ink,
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 700,
        whiteSpace: "nowrap",
        boxShadow: `0 16px 40px -10px rgba(0,0,0,0.7), 0 0 0 ${working ? 6 + 6 * pulse : 0}px rgba(195,236,110,${working ? 0.25 : 0})`,
        zIndex: 30,
      }}
    >
      <AgentGlyph size={26} color={C.ink} stroke={2.2} />
      {label}
    </div>
  );
};

/** Two-beat headline: the pain (white), then at `switchAt` the result (accent) replaces it. */
export const PainTitle: React.FC<{ index: string; label: string; pain: string; result: string; switchAt: number }> = ({
  index,
  label,
  pain,
  result,
  switchAt,
}) => {
  const frame = useCurrentFrame();
  const lp = enter(frame, 0);
  const out = ramp01(frame, switchAt, switchAt + 8);
  const line: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    fontSize: 80,
    lineHeight: 1.02,
    fontWeight: 700,
    letterSpacing: "-0.045em",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "absolute", left: PAD, top: 92, fontFamily: FONT, width: 1728 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: MONO,
          fontSize: 20,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: C.muted,
          opacity: lp,
          transform: `translateX(${(1 - lp) * -20}px)`,
        }}
      >
        <span style={{ color: C.accent }}>{index}</span>
        <span style={{ width: 28, height: 1, background: C.lineHi }} />
        {label}
      </div>
      <div style={{ position: "relative", marginTop: 16, height: 92 }}>
        <div style={{ ...line, color: C.text, opacity: 1 - out, transform: `translateY(${-out * 50}px)` }}>
          {pain.split(" ").map((w, i) => {
            const p = pop(frame, 3 + i * 2.2);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.22em",
                  opacity: Math.min(1, p * 1.6),
                  transform: `translateY(${(1 - p) * 50}px) scale(${0.7 + 0.3 * p})`,
                  transformOrigin: "left bottom",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {frame >= switchAt + 2 ? (
          <div style={{ ...line, color: C.accent }}>
            {result.split(" ").map((w, i) => {
              const p = pop(frame, switchAt + 3 + i * 2.2, 10);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    marginRight: "0.22em",
                    opacity: Math.min(1, p * 1.6),
                    transform: `translateY(${(1 - p) * 60}px) scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -5}deg)`,
                    transformOrigin: "left bottom",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ramp01 = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));

/** CSS-3D wireframe cube driven by the frame. */
export const Cube3D: React.FC<{ size: number; rotY: number; rotX?: number; glow?: number; style?: React.CSSProperties }> = ({
  size,
  rotY,
  rotX = -22,
  glow = 0,
  style,
}) => {
  const h = size / 2;
  const faces = [
    `translateZ(${h}px)`,
    `rotateY(180deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ];
  return (
    <div style={{ width: size, height: size, perspective: size * 5, ...style }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {faces.map((tf, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              transform: tf,
              border: `3px solid rgba(195,236,110,${0.55 + 0.4 * glow})`,
              background: `rgba(195,236,110,${(i === 4 ? 0.12 : 0.04) + 0.08 * glow})`,
              borderRadius: size * 0.04,
            }}
          />
        ))}
      </div>
    </div>
  );
};
