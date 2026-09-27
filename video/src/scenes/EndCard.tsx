import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { enter, ramp, typed } from "../ui/anim";
import { Caret } from "../ui/primitives";

export const EndCard: React.FC<{ lead?: string; extra?: string; urlAt?: number; cpf?: number }> = ({
  lead = copy.end.lead,
  extra = copy.end.extra,
  urlAt: URL_AT = 12,
  cpf: CPF = 1.3,
}) => {
  const frame = useCurrentFrame();
  const { url, byline } = copy.brand;
  const leadP = enter(frame, 2);
  const n = typed(frame, url, URL_AT, CPF);
  const done = n === url.length;
  const bar = ramp(frame, URL_AT + 12, URL_AT + 36);
  const byP = enter(frame, URL_AT + 28);
  const exP = enter(frame, URL_AT + 38);
  const dot = url.indexOf(".");

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <div style={{ position: "absolute", left: PAD, top: 330 }}>
        <div
          style={{
            fontSize: 46,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: C.sub,
            opacity: leadP,
            transform: `translateY(${(1 - leadP) * 16}px)`,
          }}
        >
          {lead}
        </div>

        <div style={{ marginTop: 30, fontSize: 168, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1, whiteSpace: "nowrap" }}>
          <span style={{ color: C.accent }}>{url.slice(0, Math.min(n, dot))}</span>
          <span>{n > dot ? url.slice(dot, n) : ""}</span>
          {!done && frame >= URL_AT ? <Caret h={140} /> : null}
        </div>
        <div style={{ marginTop: 26, height: 3, width: 1350 * bar, background: C.accent }} />

        <div
          style={{
            marginTop: 44,
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: "0.02em",
            color: C.text,
            opacity: byP,
            transform: `translateY(${(1 - byP) * 12}px)`,
          }}
        >
          {byline}
        </div>
        <div style={{ marginTop: 14, fontSize: 26, color: C.muted, opacity: exP, transform: `translateY(${(1 - exP) * 12}px)` }}>{extra}</div>
      </div>
    </AbsoluteFill>
  );
};
