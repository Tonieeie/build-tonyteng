import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { enter, ramp } from "../ui/anim";

const BigLine: React.FC<{ text: string; start: number; accentWord?: string }> = ({ text, start, accentWord }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontSize: 132, lineHeight: 1.02, fontWeight: 600, letterSpacing: "-0.045em", whiteSpace: "nowrap" }}>
      {text.split(" ").map((w, i) => {
        const p = enter(frame, start + i * 3);
        const isAccent = accentWord && w.startsWith(accentWord);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: "0.22em" }}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 110}%)`,
                color: isAccent ? C.accent : C.text,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { line1, line2, sub, chores } = copy.hook;
  const subP = enter(frame, 84);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <div style={{ position: "absolute", left: PAD, top: 300 }}>
        <BigLine text={line1} start={4} />
        <BigLine text={line2} start={66} accentWord="AI" />
        <div
          style={{
            marginTop: 44,
            fontSize: 30,
            color: C.muted,
            opacity: subP,
            transform: `translateY(${(1 - subP) * 16}px)`,
          }}
        >
          {sub}
        </div>
      </div>

      <div style={{ position: "absolute", left: 1210, top: 318, width: 620, display: "flex", flexDirection: "column", gap: 26 }}>
        {chores.map((c, i) => {
          const inAt = 14 + i * 7;
          const strikeAt = 38 + i * 10;
          const p = enter(frame, inAt);
          const s = ramp(frame, strikeAt, strikeAt + 12);
          return (
            <div
              key={c}
              style={{
                position: "relative",
                alignSelf: "flex-start",
                fontFamily: MONO,
                fontSize: 24,
                color: s > 0.5 ? C.faint : C.sub,
                opacity: p,
                transform: `translateX(${(1 - p) * 30}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {c}
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  top: "52%",
                  height: 3,
                  width: `calc(${s * 100}% + ${s * 12}px)`,
                  background: C.accent,
                  borderRadius: 2,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
