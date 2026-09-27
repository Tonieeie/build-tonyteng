import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO } from "../theme";
import { ramp } from "../ui/anim";
import { AgentGlyph } from "../ui/icons";
import { KineticTitle, pop } from "./kit";

const s = copy.short.connect;

const CORE = { x: 960, y: 650 };
const RX = 640;
const RY = 250;
const nodePos = (i: number) => {
  const a = ((-90 + i * 45) * Math.PI) / 180;
  return { x: CORE.x + RX * Math.cos(a), y: CORE.y + RY * Math.sin(a) };
};

const LIT_FROM = 18; // nodes light up one after another from here
const LIT_EVERY = 4;

export const Connect: React.FC = () => {
  const frame = useCurrentFrame();
  const coreP = pop(frame, 2, 10);
  const lit = frame >= LIT_FROM ? Math.floor((frame - LIT_FROM) / LIT_EVERY) % s.tools.length : -1;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <KineticTitle label={s.label} title={s.title} />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {s.tools.map((tool, i) => {
          const n = nodePos(i);
          const len = Math.hypot(n.x - CORE.x, n.y - CORE.y);
          const draw = ramp(frame, 6 + i * 1.5, 16 + i * 1.5);
          const on = i === lit;
          const q = frame >= 16 ? (((frame - 16) / (on ? 10 : 24) + i * 0.37) % 1) : -1;
          const dir = i % 2 === 0 ? q : 1 - q;
          return (
            <g key={tool}>
              <line
                x1={CORE.x}
                y1={CORE.y}
                x2={n.x}
                y2={n.y}
                stroke={on ? C.accent : "rgba(255,255,255,0.18)"}
                strokeWidth={on ? 3.5 : 1.6}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - draw)}
              />
              {q >= 0 ? (
                <circle
                  cx={CORE.x + (n.x - CORE.x) * dir}
                  cy={CORE.y + (n.y - CORE.y) * dir}
                  r={on ? 7 : 5}
                  fill={C.accent}
                  opacity={Math.sin(q * Math.PI) * (on ? 1 : 0.7)}
                />
              ) : null}
            </g>
          );
        })}
        {[0, 1, 2].map((k) => {
          if (frame < 8) return null;
          const q = ((((frame - 8 + k * 15) % 45) + 45) % 45) / 45;
          return <circle key={k} cx={CORE.x} cy={CORE.y} r={80 + 160 * q} fill="none" stroke={C.accent} strokeWidth={2} opacity={0.45 * (1 - q)} />;
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: CORE.x - 84,
          top: CORE.y - 84,
          width: 168,
          height: 168,
          borderRadius: 84,
          background: C.accent,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transform: `scale(${coreP})`,
          boxShadow: "0 0 0 10px rgba(195,236,110,0.10)",
        }}
      >
        <AgentGlyph size={56} color={C.ink} stroke={2} />
        <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 500, color: C.ink }}>{s.core}</span>
      </div>

      {s.tools.map((tool, i) => {
        const n = nodePos(i);
        const p = pop(frame, 4 + i * 1.5, 12);
        const on = i === lit;
        return (
          <div
            key={tool}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              transform: `translate(-50%, -50%) scale(${p * (on ? 1.14 : 1)})`,
              height: 60,
              padding: "0 26px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              background: on ? "#26301A" : C.panel,
              border: `1.5px solid ${on ? C.accent : C.lineHi}`,
              color: on ? C.accent : C.text,
              boxShadow: "0 14px 30px -14px rgba(0,0,0,0.8)",
            }}
          >
            {tool}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
