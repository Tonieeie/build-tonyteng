import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD, W } from "../theme";
import { enter, ramp } from "../ui/anim";
import { SceneHeader } from "../ui/primitives";

const t = copy.how;

const LINE_Y = 430;
const COL_W = (W - PAD * 2) / 3;
const STEP_AT = [30, 88, 146];

export const HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = ramp(frame, STEP_AT[0], STEP_AT[2], 0, 1);
  const noteP = enter(frame, 196);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <SceneHeader label={t.label} title={t.title} titleWidth={1600} />

      {/* rail */}
      <div style={{ position: "absolute", left: PAD + 28, top: LINE_Y, width: COL_W * 2, height: 2, background: C.line }} />
      <div
        style={{
          position: "absolute",
          left: PAD + 28,
          top: LINE_Y,
          width: COL_W * 2 * fill,
          height: 2,
          background: C.accent,
        }}
      />

      {t.steps.map((s, i) => {
        const at = STEP_AT[i];
        const p = enter(frame, at);
        const lit = ramp(frame, at, at + 8);
        const x = PAD + i * COL_W;
        return (
          <div key={s.n} style={{ position: "absolute", left: x, top: LINE_Y - 28, width: COL_W - 60 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: 18,
                background: lit > 0.5 ? C.accent : C.panel,
                color: lit > 0.5 ? C.ink : C.muted,
                border: `1.5px solid ${lit > 0.5 ? C.accent : C.lineHi}`,
                transform: `scale(${1 + 0.12 * Math.sin(lit * Math.PI)})`,
              }}
            >
              {s.n}
            </div>
            <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
              <div style={{ marginTop: 44, fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{s.title}</div>
              <div style={{ marginTop: 18, fontSize: 25, lineHeight: 1.45, color: C.muted, maxWidth: 470 }}>{s.body}</div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 770,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: noteP,
          transform: `translateY(${(1 - noteP) * 16}px)`,
        }}
      >
        <div style={{ width: 40, height: 2, background: C.accent }} />
        <div style={{ fontSize: 28, color: C.sub }}>
          Not what you need? <span style={{ color: C.text, fontWeight: 600 }}>You owe nothing.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
