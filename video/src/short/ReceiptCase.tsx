import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO } from "../theme";
import { EASE, enter, path, ramp, type Key } from "../ui/anim";
import { Check, Doc, Spinner } from "../ui/icons";
import { Pill, Window } from "../ui/primitives";
import { HelperBadge, KineticTitle, pop, StepsBar } from "./kit";

const s = copy.short.receipts;

export const RCPT = {
  steps: [6, 46, 112],
  doneAt: 160,
  paper: 8,
  snap: 28,
  helperIn: 44,
  scan: [46, 66] as [number, number],
  marks: [50, 56, 62],
  fly: [68, 72, 76],
  flyDur: 14,
  category: 90,
  photo: 96,
  saved: 102,
  sync: 112,
  synced: 126,
};

/* ---- phone (your own app) ---- */
const PHONE = { x: 150, y: 250, w: 400, h: 620 };
const VIEW = { x: 176, y: 348, w: 348, h: 412 };
const PAPER = { x: VIEW.x + (VIEW.w - 280) / 2, y: VIEW.y + (VIEW.h - 330) / 2, w: 280, h: 330 };
const R_STORE = { x: PAPER.x + 18, y: PAPER.y + 16, w: 244, h: 28 };
const R_DATE = { x: PAPER.x + 18, y: PAPER.y + 50, w: 140, h: 20 };
const R_TOTAL = { x: PAPER.x + 18, y: PAPER.y + 262, w: 244, h: 34 };

/* ---- database window ---- */
const WIN = { x: 640, y: 250, w: 1184, h: 620 };
const BODY = { x: WIN.x + 1, y: WIN.y + 49 };
const TABLE_X = 24;
const HEAD_Y = 24;
const ROW0 = 68;
const ROW_H = 72;
const COLS = "2fr 1fr 1fr 1fr 90px";
const COL_X = [16, 421.6, 624.4]; // content x of store / date / total, relative to the table
const NEW_ROW_Y = BODY.y + ROW0 + 2 * ROW_H;

const helperKeys: Key[] = [
  { f: RCPT.helperIn, x: PAPER.x + PAPER.w / 2, y: PAPER.y - 22 },
  { f: RCPT.fly[0], x: PAPER.x + PAPER.w / 2, y: PAPER.y - 22 },
  { f: RCPT.fly[2] + RCPT.flyDur, x: BODY.x + 940, y: NEW_ROW_Y + ROW_H / 2 },
];

const Cloud: React.FC<{ size?: number; color: string }> = ({ size = 22, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 18.5h10.5a4 4 0 00.6-7.95A6 6 0 006.4 9.1 4.7 4.7 0 007 18.5z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
  </svg>
);
const Database: React.FC<{ size?: number; color: string }> = ({ size = 22, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="6" rx="7" ry="2.8" stroke={color} strokeWidth="1.8" />
    <path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" stroke={color} strokeWidth="1.8" />
  </svg>
);
const Camera: React.FC<{ size?: number; color: string }> = ({ size = 22, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 8h3l1.6-2.2h6.8L17 8h3v11H4z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
    <circle cx="12" cy="13.2" r="3.4" stroke={color} strokeWidth="1.9" />
  </svg>
);

const Mark: React.FC<{ box: { x: number; y: number; w: number; h: number }; at: number }> = ({ box, at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = pop(frame, at, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: box.x - 6,
        top: box.y - 4,
        width: box.w + 12,
        height: box.h + 8,
        borderRadius: 6,
        border: "2.5px solid rgba(142,190,40,0.95)",
        background: "rgba(142,190,40,0.16)",
        transform: `scale(${1.1 - 0.1 * p})`,
        zIndex: 3,
      }}
    />
  );
};

/** Receipt paper (scene coords so the fly-out chips line up). */
const Paper: React.FC = () => {
  const frame = useCurrentFrame();
  const p = pop(frame, RCPT.paper, 14);
  const scanY = interpolate(frame, RCPT.scan, [0, PAPER.h], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const scanning = frame >= RCPT.scan[0] && frame <= RCPT.scan[1] + 4;
  return (
    <div
      style={{
        position: "absolute",
        left: PAPER.x,
        top: PAPER.y,
        width: PAPER.w,
        height: PAPER.h,
        padding: 18,
        background: "#ECECE7",
        color: "#16181C",
        borderRadius: 4,
        fontFamily: FONT,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 40}px) rotate(${(1 - p) * -6}deg)`,
        overflow: "hidden",
        boxShadow: "0 18px 40px -16px rgba(0,0,0,0.7)",
        zIndex: 2,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, height: 28 }}>{s.store}</div>
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 14, color: "#6B7079" }}>{s.date}</div>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        {s.items.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span>{k}</span>
            <span style={{ fontFamily: MONO }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 222, display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7079" }}>
        <span>incl. GST</span>
        <span style={{ fontFamily: MONO }}>{s.gst}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 252,
          paddingTop: 10,
          borderTop: "1.5px dashed rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 23,
          fontWeight: 700,
        }}
      >
        <span>TOTAL</span>
        <span style={{ fontFamily: MONO }}>{s.total}</span>
      </div>
      {scanning ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY - 50,
            height: 50,
            background: "linear-gradient(to bottom, rgba(195,236,110,0), rgba(195,236,110,0.35))",
            borderBottom: `3px solid ${C.accent}`,
          }}
        />
      ) : null}
    </div>
  );
};

const PhoneApp: React.FC = () => {
  const frame = useCurrentFrame();
  const state = frame >= RCPT.saved ? "done" : frame >= RCPT.snap ? "reading" : "scan";
  const press = frame >= RCPT.snap && frame < RCPT.snap + 5;
  const doneP = pop(frame, RCPT.saved, 11);
  const corner = (l: boolean, t: boolean): React.CSSProperties => ({
    position: "absolute",
    width: 30,
    height: 30,
    [l ? "left" : "right"]: 14,
    [t ? "top" : "bottom"]: 14,
    borderLeft: l ? `3px solid ${C.text}` : undefined,
    borderRight: l ? undefined : `3px solid ${C.text}`,
    borderTop: t ? `3px solid ${C.text}` : undefined,
    borderBottom: t ? undefined : `3px solid ${C.text}`,
    opacity: frame < RCPT.snap + 6 ? 0.85 : 0.25,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: PHONE.x,
        top: PHONE.y,
        width: PHONE.w,
        height: PHONE.h,
        borderRadius: 50,
        background: "#101114",
        border: "10px solid #1E2127",
        overflow: "hidden",
        boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)",
        opacity: enter(frame, 0),
        fontFamily: FONT,
      }}
    >
      {/* app header: it's *their* app */}
      <div style={{ position: "absolute", left: 16, right: 16, top: 26, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Doc size={24} color={C.ink} stroke={2} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{s.appName}</div>
          <div style={{ fontSize: 14, color: C.muted }}>{s.appOwner}</div>
        </div>
      </div>
      {/* camera viewport */}
      <div
        style={{
          position: "absolute",
          left: VIEW.x - PHONE.x - 10,
          top: VIEW.y - PHONE.y - 10,
          width: VIEW.w,
          height: VIEW.h,
          borderRadius: 18,
          background: "#2A2D33",
          overflow: "hidden",
        }}
      >
        <div style={corner(true, true)} />
        <div style={corner(false, true)} />
        <div style={corner(true, false)} />
        <div style={corner(false, false)} />
      </div>
      {/* scan button */}
      <div
        style={{
          position: "absolute",
          left: VIEW.x - PHONE.x - 10,
          top: VIEW.y - PHONE.y - 10 + VIEW.h + 16,
          width: VIEW.w,
          height: 60,
          borderRadius: 30,
          background: state === "done" ? C.accent : state === "reading" ? "#1C2216" : C.accent,
          border: state === "reading" ? `1.5px solid ${C.accentLine}` : "none",
          color: state === "reading" ? C.accent : C.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: 22,
          fontWeight: 700,
          transform: `scale(${press ? 0.95 : state === "done" ? 0.9 + 0.1 * doneP : 1})`,
        }}
      >
        {state === "scan" ? <Camera color={C.ink} /> : state === "reading" ? <Spinner size={20} color={C.accent} turn={(frame % 20) / 20} /> : <Check size={20} color={C.ink} stroke={2.6} />}
        {state === "scan" ? s.scan : state === "reading" ? s.reading : s.uploaded}
      </div>
    </div>
  );
};

/** Camera flash over the whole phone, including the receipt. */
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = frame >= RCPT.snap ? 1 - ramp(frame, RCPT.snap, RCPT.snap + 8) : 0;
  if (flash <= 0) return null;
  return <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: 50, background: "#fff", opacity: flash * 0.8, zIndex: 25 }} />;
};

/* ---------- database ---------- */

const Thumb: React.FC = () => (
  <div style={{ width: 50, height: 58, borderRadius: 6, background: "#ECECE7", padding: "8px 7px", display: "flex", flexDirection: "column", gap: 5 }}>
    {[0.9, 0.6, 0.75, 0.5].map((w, i) => (
      <span key={i} style={{ height: 4, width: `${w * 100}%`, borderRadius: 2, background: i === 0 ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.18)" }} />
    ))}
  </div>
);

const SyncPill: React.FC = () => {
  const frame = useCurrentFrame();
  const syncing = frame >= RCPT.sync && frame < RCPT.synced;
  const synced = frame >= RCPT.synced;
  const p = pop(frame, RCPT.synced, 11);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 34,
        padding: "0 14px",
        borderRadius: 17,
        fontSize: 16,
        fontWeight: 600,
        background: synced ? C.accentDim : "rgba(255,255,255,0.06)",
        border: `1px solid ${synced ? C.accentLine : C.line}`,
        color: synced || syncing ? C.accent : C.muted,
        transform: `scale(${synced ? 0.85 + 0.15 * p : 1})`,
        whiteSpace: "nowrap",
      }}
    >
      {syncing ? <Spinner size={16} color={C.accent} turn={(frame % 20) / 20} /> : <Cloud size={18} color={synced ? C.accent : C.muted} />}
      {syncing ? s.syncing : synced ? `${s.synced} ✓` : "Up to date"}
    </span>
  );
};

const DB: React.FC = () => {
  const frame = useCurrentFrame();
  const landed = (i: number) => frame >= RCPT.fly[i] + RCPT.flyDur - 1;
  const rowIn = pop(frame, RCPT.fly[0] - 2, 13);
  const saved = frame >= RCPT.saved;
  const glow = ramp(frame, RCPT.saved, RCPT.saved + 3) * (1 - ramp(frame, RCPT.saved + 12, RCPT.saved + 34));
  const catP = pop(frame, RCPT.category, 11);
  const photoP = pop(frame, RCPT.photo, 11);
  const bannerP = pop(frame, RCPT.synced + 2, 12);
  const row: React.CSSProperties = {
    position: "absolute",
    left: TABLE_X,
    right: TABLE_X,
    height: ROW_H,
    display: "grid",
    gridTemplateColumns: COLS,
    alignItems: "center",
    padding: "0 16px",
    borderBottom: `1px solid ${C.line}`,
    fontSize: 22,
  };
  const newVals = [s.newRow.store, s.newRow.date, s.newRow.total];
  return (
    <Window
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Database size={20} color={C.text} />
          <span style={{ color: C.text, fontSize: 18 }}>{s.db}</span>
          <span style={{ color: C.faint, fontFamily: MONO, fontSize: 15 }}>/ {s.table}</span>
        </span>
      }
      right={<SyncPill />}
      style={{ left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, opacity: enter(frame, 4) }}
    >
      <div
        style={{
          ...row,
          top: HEAD_Y,
          height: 44,
          fontFamily: MONO,
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: C.faint,
        }}
      >
        {s.cols.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {s.rows.map((r, i) => (
        <div key={r.store} style={{ ...row, top: ROW0 + i * ROW_H }}>
          <span>{r.store}</span>
          <span style={{ fontFamily: MONO, fontSize: 19, color: C.sub }}>{r.date}</span>
          <span style={{ fontFamily: MONO, fontSize: 19, color: C.sub }}>{r.total}</span>
          <span>
            <Pill tone="neutral" style={{ fontSize: 15 }}>
              {r.cat}
            </Pill>
          </span>
          <Thumb />
        </div>
      ))}
      {frame >= RCPT.fly[0] - 2 ? (
        <div
          style={{
            ...row,
            top: ROW0 + 2 * ROW_H,
            background: `rgba(195,236,110,${0.05 + 0.1 * glow})`,
            boxShadow: saved ? `inset 3px 0 0 ${C.accent}` : `inset 0 0 0 1.5px rgba(195,236,110,0.35)`,
            opacity: Math.min(1, rowIn * 1.4),
          }}
        >
          {newVals.map((v, i) => (
            <span
              key={i}
              style={{
                fontFamily: i === 0 ? FONT : MONO,
                fontSize: i === 0 ? 22 : 19,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? C.text : C.sub,
                opacity: landed(i) ? 1 : 0,
              }}
            >
              {v}
            </span>
          ))}
          <span>
            {frame >= RCPT.category ? (
              <span style={{ display: "inline-block", transform: `scale(${0.6 + 0.4 * catP})` }}>
                <Pill tone="accent" style={{ fontSize: 15 }}>
                  {s.newRow.cat}
                </Pill>
              </span>
            ) : null}
          </span>
          <span style={{ position: "relative", display: "inline-block", opacity: frame >= RCPT.photo ? 1 : 0, transform: `scale(${0.6 + 0.4 * photoP})` }}>
            <Thumb />
            {saved ? (
              <span style={{ position: "absolute", right: -8, bottom: -6, width: 24, height: 24, borderRadius: 12, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={14} color={C.ink} stroke={2.8} />
              </span>
            ) : null}
          </span>
        </div>
      ) : null}
      {frame >= RCPT.synced + 2 ? (
        <div
          style={{
            position: "absolute",
            left: TABLE_X,
            right: TABLE_X,
            top: ROW0 + 3 * ROW_H + 34,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 26px",
            borderRadius: 16,
            background: "#1C2216",
            border: `1.5px solid ${C.accentLine}`,
            opacity: Math.min(1, bannerP * 1.4),
            transform: `translateY(${(1 - bannerP) * 20}px)`,
          }}
        >
          <Cloud size={30} color={C.accent} />
          <Database size={28} color={C.accent} />
          <span style={{ fontSize: 24, fontWeight: 600 }}>Saved to your cloud and your database.</span>
          <span style={{ marginLeft: "auto", fontSize: 18, color: C.muted }}>Nothing typed by hand.</span>
        </div>
      ) : null}
    </Window>
  );
};

/** Upload packet: row → cloud pill while syncing. */
const Packet: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < RCPT.sync || frame > RCPT.synced) return null;
  const t = interpolate(frame, [RCPT.sync, RCPT.synced - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const from = { x: BODY.x + 1100, y: NEW_ROW_Y + ROW_H / 2 };
  const to = { x: WIN.x + WIN.w - 130, y: WIN.y + 24 };
  return (
    <div
      style={{
        position: "absolute",
        left: from.x + (to.x - from.x) * t - 14,
        top: from.y + (to.y - from.y) * t - 14 - Math.sin(t * Math.PI) * 60,
        width: 28,
        height: 28,
        borderRadius: 14,
        background: C.accent,
        boxShadow: "0 0 0 8px rgba(195,236,110,0.2)",
        opacity: 1 - ramp(frame, RCPT.synced - 4, RCPT.synced),
        zIndex: 30,
      }}
    />
  );
};

const Chips: React.FC = () => {
  const frame = useCurrentFrame();
  const from = [R_STORE, R_DATE, R_TOTAL];
  const vals = [s.newRow.store, s.newRow.date, s.newRow.total];
  return (
    <>
      {from.map((b, i) => {
        const st = RCPT.fly[i];
        if (frame < st || frame > st + RCPT.flyDur) return null;
        const p = interpolate(frame, [st, st + RCPT.flyDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
        const to = { x: BODY.x + TABLE_X + COL_X[i], y: NEW_ROW_Y + 18 };
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x + (to.x - b.x) * p,
              top: b.y + (to.y - b.y) * p - Math.sin(p * Math.PI) * 90,
              transform: `scale(${1 + Math.sin(p * Math.PI) * 0.2})`,
              padding: "6px 14px",
              borderRadius: 9,
              background: C.accent,
              color: C.ink,
              fontWeight: 700,
              fontSize: 20,
              fontFamily: i === 0 ? FONT : MONO,
              whiteSpace: "nowrap",
              boxShadow: "0 14px 30px -10px rgba(0,0,0,0.7)",
              zIndex: 20,
            }}
          >
            {vals[i]}
          </div>
        );
      })}
    </>
  );
};

const Helper: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < RCPT.helperIn || frame > RCPT.sync) return null;
  const { x, y } = path(frame, helperKeys);
  const show = pop(frame, RCPT.helperIn, 11) * (1 - ramp(frame, RCPT.saved + 2, RCPT.sync));
  return <HelperBadge x={x} y={y} label={copy.short.helper} show={show} working={frame < RCPT.fly[0]} />;
};

export const ReceiptCase: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
    <KineticTitle index={s.index} label={s.label} title={s.title} size={76} />
    <DB />
    <PhoneApp />
    <Paper />
    <Flash />
    <Mark box={R_STORE} at={RCPT.marks[0]} />
    <Mark box={R_DATE} at={RCPT.marks[1]} />
    <Mark box={R_TOTAL} at={RCPT.marks[2]} />
    <Chips />
    <Packet />
    <Helper />
    <StepsBar steps={s.steps} at={RCPT.steps} doneAt={RCPT.doneAt} />
  </AbsoluteFill>
);
