import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { enter, ramp } from "../ui/anim";
import { pop } from "./kit";

const t = copy.short.smash;

const IMPACT = 45; // frame the word lands (on the beat: 1.5s at 120 BPM)
const SHARDS = 3;

// Card grid: 4 × 4, slightly messy.
const CARD_W = 410;
const CARD_H = 92;
const cardPos = (i: number) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return {
    x: PAD + col * (CARD_W + 29) + (random(`x${i}`) - 0.5) * 30,
    y: 250 + row * (CARD_H + 26) + (random(`y${i}`) - 0.5) * 20,
    rot: (random(`r${i}`) - 0.5) * 7,
  };
};
const IMPACT_AT = { x: 560, y: 470 };

const Card: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { x, y, rot } = cardPos(i);
  const inAt = 2 + i * 2.1;
  const slap = ramp(frame, inAt, inAt + 5);
  // Anticipation tremble just before impact.
  const tremble = frame > IMPACT - 10 && frame < IMPACT ? Math.sin(frame * 3.1 + i) * 3 : 0;

  const cx = x + CARD_W / 2;
  const cy = y + CARD_H / 2;
  const dx = cx - IMPACT_AT.x;
  const dy = cy - IMPACT_AT.y;
  const d = Math.max(1, Math.hypot(dx, dy));

  const shards = Array.from({ length: SHARDS }, (_, s) => {
    const tt = Math.max(0, frame - IMPACT);
    const speed = 22 + random(`s${i}-${s}`) * 26;
    const vx = (dx / d) * speed + (s - 1) * 6;
    const vy = (dy / d) * speed - 10 - random(`k${i}-${s}`) * 10;
    const g = 1.6;
    const px = vx * tt;
    const py = vy * tt + 0.5 * g * tt * tt;
    const spin = (random(`w${i}-${s}`) - 0.5) * 30 * tt;
    const fade = 1 - ramp(frame, IMPACT + 6, IMPACT + 26);
    return { px, py, spin, fade };
  });

  const clip = (s: number) => {
    const a = (s / SHARDS) * 100;
    const b = ((s + 1) / SHARDS) * 100;
    // Jagged vertical cuts.
    const j1 = s === 0 ? 0 : a + (random(`j${i}-${s}`) - 0.5) * 8;
    const j2 = s === SHARDS - 1 ? 100 : b + (random(`j${i}-${s + 1}`) - 0.5) * 8;
    return `polygon(${a}% 0%, ${b}% 0%, ${j2}% 100%, ${j1}% 100%)`;
  };

  const body = (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 14,
        background: C.panel,
        border: `1px solid ${C.lineHi}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        fontFamily: MONO,
        fontSize: 21,
        color: C.sub,
        boxShadow: "0 18px 40px -20px rgba(0,0,0,0.8)",
      }}
    >
      <span style={{ whiteSpace: "nowrap" }}>{t.tasks[i]}</span>
      <span style={{ color: C.warn, fontSize: 19 }}>{t.counts[i]}</span>
    </div>
  );

  if (frame < inAt) return null;
  return (
    <>
      {Array.from({ length: SHARDS }, (_, s) => {
        const sh = shards[s];
        if (sh.fade <= 0) return null;
        return (
          <div
            key={s}
            style={{
              position: "absolute",
              left: x,
              top: y,
              clipPath: clip(s),
              opacity: slap * sh.fade,
              transform: `translate(${sh.px + tremble}px, ${sh.py}px) rotate(${rot + sh.spin}deg) scale(${1.25 - 0.25 * slap})`,
              transformOrigin: "50% 50%",
            }}
          >
            {body}
          </div>
        );
      })}
    </>
  );
};

export const Smash: React.FC = () => {
  const frame = useCurrentFrame();

  // Word slams in: big + blurred → landed.
  const fall = interpolate(frame, [IMPACT - 10, IMPACT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const wordScale = 4.2 - 3.2 * fall;
  const wordBlur = (1 - fall) * 14;

  // Screen shake after impact, decaying.
  const k = Math.max(0, 1 - (frame - IMPACT) / 20);
  const shaking = frame >= IMPACT ? k * k : 0;
  const sx = Math.sin(frame * 2.7) * 26 * shaking;
  const sy = Math.cos(frame * 3.3) * 18 * shaking;

  const flash = frame >= IMPACT ? 1 - ramp(frame, IMPACT, IMPACT + 7) : 0;
  const ring = ramp(frame, IMPACT, IMPACT + 24);

  const restP = (i: number) => pop(frame, IMPACT + 10 + i * 3, 13);
  const subP = enter(frame, IMPACT + 30);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {t.tasks.map((_, i) => (
          <Card key={i} i={i} />
        ))}

        {/* shockwave */}
        {frame >= IMPACT && ring < 1 ? (
          <div
            style={{
              position: "absolute",
              left: IMPACT_AT.x - 900 * ring,
              top: IMPACT_AT.y - 900 * ring,
              width: 1800 * ring,
              height: 1800 * ring,
              borderRadius: "50%",
              border: `${6 * (1 - ring) + 1}px solid ${C.accent}`,
              opacity: 1 - ring,
            }}
          />
        ) : null}

        {/* SMASH */}
        {frame >= IMPACT - 10 ? (
          <div
            style={{
              position: "absolute",
              left: PAD - 8,
              top: 250,
              fontSize: 260,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              color: C.accent,
              opacity: Math.min(1, fall * 2),
              transform: `scale(${wordScale})`,
              transformOrigin: `${IMPACT_AT.x - PAD}px ${IMPACT_AT.y - 250}px`,
              filter: wordBlur > 0.2 ? `blur(${wordBlur}px)` : undefined,
            }}
          >
            {t.word}
          </div>
        ) : null}

        {/* rest of the line */}
        <div
          style={{
            position: "absolute",
            left: PAD,
            top: 540,
            fontSize: 118,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            whiteSpace: "nowrap",
          }}
        >
          {t.rest.split(" ").map((w, i) => {
            const p = restP(i);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.22em",
                  opacity: Math.min(1, p * 1.5),
                  transform: `translateY(${(1 - p) * 70}px) rotate(${(1 - p) * 5}deg)`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: PAD,
            top: 704,
            fontSize: 34,
            color: C.muted,
            opacity: subP,
            transform: `translateY(${(1 - subP) * 16}px)`,
          }}
        >
          {t.sub}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "#F2F2EE", opacity: flash * 0.28, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
