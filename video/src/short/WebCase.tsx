import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { EASE, enter, ramp, typed } from "../ui/anim";
import { Check } from "../ui/icons";
import { Caret, UrlBar, Window } from "../ui/primitives";
import { KineticTitle, pop, StepsBar } from "./kit";
import { Mug3D, type MugTiming } from "./Mug3D";

const s = copy.short.web;

export const WEB = {
  steps: [6, 50, 140],
  doneAt: 186,
  photo: 10,
  notes: [18, 26, 32, 38],
  nav: 52,
  mugFly: [54, 66] as [number, number],
  headline: 58,
  sub: 66,
  cta: 72,
  features: [128, 132, 136],
  review: 140,
  optimise: 142,
  gauges: [148, 154, 160],
  search: 166,
};

/** The 3D product shot: appears in the hero, camera pushes in, hot chocolate pours, camera pulls back. */
export const MUG: MugTiming = {
  appear: 62,
  push: [78, 92],
  pour: [94, 114],
  fill: [97, 116],
  steam: 110,
  pull: [122, 136],
};

const NOTES = { x: PAD, y: 262, w: 440, h: 608 };
const PHOTO = { x: NOTES.x + 24, y: NOTES.y + 70, w: NOTES.w - 48, h: 250 };
const BROWSER = { x: 580, y: 262, w: 1244, h: 608 };
const BODY = { x: BROWSER.x + 1, y: BROWSER.y + 49 };
const HERO_IMG = { x: 660, y: 80, w: 526, h: 280 }; // body coords

const WARM = "#E9DCCB";
const CLAY = "#B8674A";
const INK = "#2A211B";

/** A glazed ceramic mug, drawn so it can fly from the notes into the website. */
const Mug: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <ellipse cx="96" cy="178" rx="70" ry="10" fill="rgba(0,0,0,0.18)" />
    <path d="M150 78c22 0 32 12 32 30s-12 32-34 34" stroke={CLAY} strokeWidth="14" fill="none" strokeLinecap="round" />
    <path d="M34 50h124l-6 112a14 14 0 01-14 13H54a14 14 0 01-14-13z" fill={CLAY} />
    <path d="M34 50h124l-2 30c-8 6-14-2-22 4s-12 14-22 8-14-10-24-4-12 12-22 6-10-8-18-4l-14-10z" fill="#F1E8DA" />
    <ellipse cx="96" cy="50" rx="62" ry="10" fill="#E3D6C3" />
    <ellipse cx="96" cy="50" rx="54" ry="7" fill="#5A3A2C" />
    <path d="M52 100c4 20 6 40 6 62" stroke="rgba(255,255,255,0.18)" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const Notes: React.FC = () => {
  const frame = useCurrentFrame();
  const photoP = pop(frame, WEB.photo, 13);
  const out = ramp(frame, WEB.optimise, WEB.optimise + 8);
  // The mug leaves the photo when it flies to the website.
  const mugGone = frame >= WEB.mugFly[0];
  return (
    <div
      style={{
        position: "absolute",
        left: NOTES.x,
        top: NOTES.y,
        width: NOTES.w,
        height: NOTES.h,
        borderRadius: 18,
        background: C.panel,
        border: `1px solid ${C.line}`,
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)",
        opacity: enter(frame, 0) * (1 - out),
        transform: `scale(${1 - 0.05 * out})`,
        fontFamily: FONT,
      }}
    >
      <div style={{ padding: "22px 24px 0", fontFamily: MONO, fontSize: 16, letterSpacing: "0.05em", textTransform: "uppercase", color: C.muted }}>{s.notesTitle}</div>
      <div
        style={{
          position: "absolute",
          left: PHOTO.x - NOTES.x,
          top: PHOTO.y - NOTES.y,
          width: PHOTO.w,
          height: PHOTO.h,
          borderRadius: 12,
          background: WARM,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: Math.min(1, photoP * 1.4),
          transform: `scale(${0.8 + 0.2 * photoP}) rotate(${(1 - photoP) * -4}deg)`,
        }}
      >
        <div style={{ opacity: mugGone ? 0.15 : 1 }}>
          <Mug size={210} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, top: PHOTO.y - NOTES.y + PHOTO.h + 28, display: "flex", flexDirection: "column", gap: 16 }}>
        {s.notes.map((n, i) => {
          const at = WEB.notes[i];
          const k = typed(frame, n, at, 2.5);
          if (frame < at) return null;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 25, color: C.text }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: C.accent, flexShrink: 0 }} />
              <span>
                {n.slice(0, k)}
                {k < n.length ? <Caret h={24} /> : null}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Grey placeholder that the real block replaces. */
const Ghost: React.FC<{ x: number; y: number; w: number; h: number; hideAt: number }> = ({ x, y, w, h, hideAt }) => {
  const frame = useCurrentFrame();
  if (frame >= hideAt + 4) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 10,
        border: "2px dashed rgba(42,33,27,0.18)",
        opacity: (1 - ramp(frame, hideAt, hideAt + 4)) * enter(frame, 4),
      }}
    />
  );
};

const Site: React.FC = () => {
  const frame = useCurrentFrame();
  const navP = pop(frame, WEB.nav, 13);
  const ctaP = pop(frame, WEB.cta, 11);
  const reviewP = pop(frame, WEB.review, 12);
  const landed = frame >= WEB.mugFly[1];
  const heroGlow = ramp(frame, WEB.mugFly[1], WEB.mugFly[1] + 3) * (1 - ramp(frame, WEB.mugFly[1] + 8, WEB.mugFly[1] + 24));
  const words = s.headline.split(" ");
  return (
    <Window title={<UrlBar url={s.url} />} style={{ left: BROWSER.x, top: BROWSER.y, width: BROWSER.w, height: BROWSER.h, opacity: enter(frame, 4) }} bodyStyle={{ background: "#F6F1EA" }}>
      {/* placeholders */}
      <Ghost x={32} y={14} w={1178} h={36} hideAt={WEB.nav} />
      <Ghost x={56} y={90} w={560} h={130} hideAt={WEB.headline} />
      <Ghost x={56} y={236} w={420} h={30} hideAt={WEB.sub} />
      <Ghost x={56} y={292} w={240} h={60} hideAt={WEB.cta} />
      <Ghost x={HERO_IMG.x} y={HERO_IMG.y} w={HERO_IMG.w} h={HERO_IMG.h} hideAt={WEB.mugFly[1]} />
      {[0, 1, 2].map((i) => (
        <Ghost key={i} x={56 + i * 386} y={392} w={360} h={72} hideAt={WEB.features[i]} />
      ))}
      <Ghost x={56} y={488} w={600} h={40} hideAt={WEB.review} />

      {/* nav */}
      {frame >= WEB.nav ? (
        <div style={{ position: "absolute", left: 32, right: 32, top: 14, height: 36, display: "flex", alignItems: "center", justifyContent: "space-between", color: INK, opacity: Math.min(1, navP * 1.4), transform: `translateY(${(1 - navP) * -12}px)` }}>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>{s.brand}</span>
          <span style={{ display: "flex", gap: 30, fontSize: 18, color: "#6B5B4F" }}>
            {s.nav.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </div>
      ) : null}

      {/* hero text */}
      <div style={{ position: "absolute", left: 56, top: 88, width: 580, fontSize: 56, lineHeight: 1.04, fontWeight: 800, letterSpacing: "-0.045em", color: INK }}>
        {words.map((w, i) => {
          const p = pop(frame, WEB.headline + i * 2, 12);
          if (frame < WEB.headline + i * 2) return null;
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.22em", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
              {w}
            </span>
          );
        })}
      </div>
      {frame >= WEB.sub ? (
        <div style={{ position: "absolute", left: 56, top: 238, fontSize: 21, color: "#6B5B4F", opacity: enter(frame, WEB.sub) }}>{s.sub}</div>
      ) : null}
      {frame >= WEB.cta ? (
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 292,
            height: 60,
            padding: "0 30px",
            borderRadius: 30,
            background: INK,
            color: "#F6F1EA",
            fontSize: 21,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            transform: `scale(${0.6 + 0.4 * ctaP})`,
            transformOrigin: "left center",
          }}
        >
          {s.cta}
        </div>
      ) : null}

      {/* hero image */}
      {landed ? (
        <div
          style={{
            position: "absolute",
            left: HERO_IMG.x,
            top: HERO_IMG.y,
            width: HERO_IMG.w,
            height: HERO_IMG.h,
            borderRadius: 18,
            background: WARM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 0 ${8 * heroGlow}px rgba(195,236,110,0.5)`,
          }}
        />
      ) : null}

      {/* features */}
      {s.features.map((f, i) => {
        const at = WEB.features[i];
        if (frame < at) return null;
        const p = pop(frame, at, 12);
        return (
          <div
            key={f}
            style={{
              position: "absolute",
              left: 56 + i * 386,
              top: 392,
              width: 360,
              height: 72,
              borderRadius: 14,
              background: "#FFFFFF",
              border: "1px solid rgba(42,33,27,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 22px",
              fontSize: 21,
              fontWeight: 600,
              color: INK,
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${(1 - p) * 20}px)`,
            }}
          >
            <span style={{ width: 34, height: 34, borderRadius: 17, background: CLAY, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={18} color="#fff" stroke={2.6} />
            </span>
            {f}
          </div>
        );
      })}

      {frame >= WEB.review ? (
        <div style={{ position: "absolute", left: 56, top: 492, display: "flex", alignItems: "center", gap: 14, fontSize: 21, color: INK, opacity: Math.min(1, reviewP * 1.4) }}>
          <span style={{ color: "#D08A2E", letterSpacing: "0.1em", fontSize: 24 }}>★★★★★</span>
          <span style={{ color: "#6B5B4F" }}>&ldquo;My new favourite mug.&rdquo;</span>
        </div>
      ) : null}
    </Window>
  );
};

/** The mug flying from the notes photo into the website hero. */
const MugFlight: React.FC = () => {
  const frame = useCurrentFrame();
  const [a, b] = WEB.mugFly;
  if (frame < a || frame >= b) return null;
  const t = interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const from = { x: PHOTO.x + PHOTO.w / 2, y: PHOTO.y + PHOTO.h / 2 };
  const to = { x: BODY.x + HERO_IMG.x + HERO_IMG.w / 2, y: BODY.y + HERO_IMG.y + HERO_IMG.h / 2 };
  const size = 210 + 40 * t;
  return (
    <div
      style={{
        position: "absolute",
        left: from.x + (to.x - from.x) * t - size / 2,
        top: from.y + (to.y - from.y) * t - size / 2 - Math.sin(t * Math.PI) * 120,
        transform: `rotate(${Math.sin(t * Math.PI) * -10}deg)`,
        zIndex: 40,
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))",
      }}
    >
      <Mug size={size} />
    </div>
  );
};

const Gauge: React.FC<{ label: string; value: number; at: number }> = ({ label, value, at }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at, 12);
  const fill = interpolate(frame, [at, at + 16], [0, value / 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const R = 46;
  const L = 2 * Math.PI * R;
  if (frame < at) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: Math.min(1, p * 1.4), transform: `scale(${0.7 + 0.3 * p})` }}>
      <div style={{ position: "relative", width: 112, height: 112 }}>
        <svg width={112} height={112} viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={R} stroke="rgba(195,236,110,0.15)" strokeWidth="9" fill="none" />
          <circle cx="56" cy="56" r={R} stroke={C.accent} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - fill)} transform="rotate(-90 56 56)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 32, fontWeight: 500, color: C.accent }}>
          {Math.round(fill * 100)}
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: C.text }}>{label}</div>
    </div>
  );
};

/** Step 3: the left column turns into the results — scores, then a search listing. */
const Results: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < WEB.optimise + 2) return null;
  const panelP = pop(frame, WEB.optimise + 2, 13);
  const searchP = pop(frame, WEB.search, 12);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: NOTES.x,
          top: NOTES.y,
          width: NOTES.w,
          padding: "22px 24px 26px",
          borderRadius: 18,
          background: C.panel,
          border: `1.5px solid ${C.accentLine}`,
          opacity: Math.min(1, panelP * 1.4),
          transform: `translateY(${(1 - panelP) * 24}px)`,
          fontFamily: FONT,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.05em", textTransform: "uppercase", color: C.muted }}>Site check</div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          {s.scores.map((sc, i) => (
            <Gauge key={sc.label} label={sc.label} value={sc.value} at={WEB.gauges[i]} />
          ))}
        </div>
      </div>
      {frame >= WEB.search ? (
        <div
          style={{
            position: "absolute",
            left: NOTES.x,
            top: NOTES.y + 262,
            width: NOTES.w,
            padding: "20px 24px 24px",
            borderRadius: 18,
            background: "#1B1D21",
            border: `1px solid ${C.lineHi}`,
            boxShadow: "0 30px 70px -24px rgba(0,0,0,0.9)",
            opacity: Math.min(1, searchP * 1.4),
            transform: `translateY(${(1 - searchP) * 30}px)`,
            fontFamily: FONT,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 16px", borderRadius: 22, background: "#2A2D33", fontSize: 18, color: C.sub }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="6.5" stroke={C.muted} strokeWidth="2.2" />
              <path d="M15.5 15.5L21 21" stroke={C.muted} strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            handmade ceramic mugs
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: C.muted }}>
            <span style={{ width: 26, height: 26, borderRadius: 13, background: CLAY, display: "inline-block" }} />
            {s.search.url}
          </div>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 600, color: "#9DB9F5", lineHeight: 1.2 }}>{s.search.title}</div>
          <div style={{ marginTop: 6, fontSize: 17, lineHeight: 1.4, color: C.muted }}>{s.search.desc}</div>
        </div>
      ) : null}
    </>
  );
};

/* ---------- 3D product shot ---------- */

// The canvas always renders at full stage size and is scaled into the hero slot,
// so the camera push-in stays sharp.
const STAGE = { w: 1166, h: 620 };
const STAGE_BIG = { x: (1920 - STAGE.w) / 2, y: 250 };
const HERO_SCENE = { x: BODY.x + HERO_IMG.x, y: BODY.y + HERO_IMG.y };
const S_SMALL = HERO_IMG.w / STAGE.w;

const pushAmount = (frame: number) =>
  interpolate(frame, MUG.push, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }) *
  (1 - interpolate(frame, MUG.pull, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }));

const Dim: React.FC = () => {
  const frame = useCurrentFrame();
  const p = pushAmount(frame);
  if (p <= 0) return null;
  return <AbsoluteFill style={{ background: "rgba(8,9,11,0.82)", opacity: p }} />;
};

const Stage3D: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < MUG.appear - 2) return null;
  const p = pushAmount(frame);
  const scale = S_SMALL + (1 - S_SMALL) * p;
  const x = HERO_SCENE.x + (STAGE_BIG.x - HERO_SCENE.x) * p;
  const y = HERO_SCENE.y + (STAGE_BIG.y - HERO_SCENE.y) * p;
  const inP = ramp(frame, MUG.appear - 2, MUG.appear + 6);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: STAGE.w,
        height: STAGE.h,
        transform: `scale(${scale})`,
        transformOrigin: "0 0",
        borderRadius: 18 / scale,
        overflow: "hidden",
        opacity: inP,
        boxShadow: p > 0 ? `0 ${60 * p}px ${140 * p}px -40px rgba(0,0,0,0.9)` : undefined,
        zIndex: 50,
      }}
    >
      <Mug3D width={STAGE.w} height={STAGE.h} timing={MUG} />
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 26,
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 46,
          padding: "0 20px",
          borderRadius: 23,
          background: "rgba(42,33,27,0.85)",
          color: "#F6F1EA",
          fontFamily: FONT,
          fontSize: 21,
          fontWeight: 600,
          opacity: p,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 5, background: C.accent }} />
        Your product in 3D
      </div>
    </div>
  );
};

export const WebCase: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
    <Site />
    <Notes />
    <Results />
    <MugFlight />
    <Dim />
    <Stage3D />
    <KineticTitle index={s.index} label={s.label} title={s.title} size={76} />
    <StepsBar steps={s.steps} at={WEB.steps} doneAt={WEB.doneAt} />
  </AbsoluteFill>
);
