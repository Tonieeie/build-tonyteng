import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { enter, ramp, typed } from "../ui/anim";
import { Caret } from "../ui/primitives";
import { pop } from "./kit";

const s = copy.short.end;

export const END = { line1: 2, line2: 12, sub: 26, url: 38, cpf: 2.2 };

const Line: React.FC<{ text: string; at: number; color: string }> = ({ text, at, color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontSize: 132, lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.055em", color, whiteSpace: "nowrap" }}>
      {text.split(" ").map((w, i) => {
        const p = pop(frame, at + i * 3, 11);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.2em",
              opacity: Math.min(1, p * 1.6),
              transform: `translateY(${(1 - p) * 80}px) scale(${0.6 + 0.4 * p})`,
              transformOrigin: "left bottom",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Final card: the slogan, then the URL. */
export const EndSlogan: React.FC = () => {
  const frame = useCurrentFrame();
  const { url } = copy.brand;
  const n = typed(frame, url, END.url, END.cpf);
  const done = n === url.length;
  const dot = url.indexOf(".");
  const subP = enter(frame, END.sub);
  const bar = ramp(frame, END.url + 6, END.url + 26);
  const exP = enter(frame, END.url + 24);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <div style={{ position: "absolute", left: PAD, top: 150 }}>
        <Line text={s.line1} at={END.line1} color={C.text} />
        <Line text={s.line2} at={END.line2} color={C.accent} />
        <div style={{ marginTop: 26, fontSize: 36, color: C.sub, opacity: subP, transform: `translateY(${(1 - subP) * 14}px)` }}>{s.sub}</div>

        <div style={{ marginTop: 70, fontSize: 104, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap", minHeight: 104 }}>
          <span style={{ color: C.accent }}>{url.slice(0, Math.min(n, dot))}</span>
          <span>{n > dot ? url.slice(dot, n) : ""}</span>
          {!done && frame >= END.url ? <Caret h={88} /> : null}
        </div>
        <div style={{ marginTop: 18, height: 3, width: 930 * bar, background: C.accent }} />
        <div style={{ marginTop: 24, fontFamily: MONO, fontSize: 24, color: C.muted, opacity: exP }}>{s.extra}</div>
      </div>
    </AbsoluteFill>
  );
};
