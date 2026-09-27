import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD, W } from "../theme";
import { enter, ramp } from "../ui/anim";
import { Arrow } from "../ui/icons";
import { KineticTitle, pop } from "./kit";

const s = copy.short.pay;
const STEP_AT = [6, 14, 22];
const COL = (W - PAD * 2) / 3;

export const Pay: React.FC = () => {
  const frame = useCurrentFrame();
  const under = ramp(frame, STEP_AT[2] + 8, STEP_AT[2] + 26);
  const noteP = enter(frame, 32);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <KineticTitle label={s.label} title={s.title} size={104} top={150} />
      {s.steps.map((st, i) => {
        const p = pop(frame, STEP_AT[i], 12);
        const last = i === s.steps.length - 1;
        return (
          <div
            key={st}
            style={{
              position: "absolute",
              left: PAD + i * COL,
              top: 520,
              width: COL - 90,
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`,
              transformOrigin: "left center",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.accent }}>0{i + 1}</div>
            <div style={{ marginTop: 14, fontSize: 50, lineHeight: 1.08, fontWeight: 700, letterSpacing: "-0.035em", textWrap: "balance", color: last ? C.accent : C.text }}>
              {st}
            </div>
            {last ? <div style={{ marginTop: 18, height: 5, width: `${under * 100}%`, borderRadius: 3, background: C.accent }} /> : null}
            {!last ? (
              <div style={{ position: "absolute", right: -70, top: 56, opacity: ramp(frame, STEP_AT[i + 1] - 4, STEP_AT[i + 1]) }}>
                <Arrow size={44} color={C.muted} stroke={1.4} />
              </div>
            ) : null}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 820,
          fontSize: 34,
          color: C.sub,
          opacity: noteP,
          transform: `translateY(${(1 - noteP) * 16}px)`,
        }}
      >
        Not what you need? <span style={{ color: C.text, fontWeight: 700 }}>You owe nothing.</span>
      </div>
    </AbsoluteFill>
  );
};
