import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { enter, path, ramp, typed, type Key } from "../ui/anim";
import { Check, Person } from "../ui/icons";
import { Caret, Pill, UrlBar, Window } from "../ui/primitives";
import { HelperBadge, KineticTitle, pop, StepsBar } from "./kit";

const s = copy.short.form;

export const FORM = {
  steps: [6, 52, 120],
  doneAt: 160,
  type: [12, 24, 32], // you type the new row
  queued: 46,
  helperIn: 52,
  fields: [76, 88, 100],
  submit: 112,
  sent: 118,
  rowDone: 136,
};

const SHEET = { x: PAD, y: 280, w: 780, h: 300 };
const BROWSER = { x: 930, y: 262, w: 894, h: 612 };
const BODY = { x: BROWSER.x + 1, y: BROWSER.y + 49 };
const COLS = "1.35fr 1fr 1.5fr 0.95fr";
const ROW_H = 64;
const NEW_ROW_CY = SHEET.y + 49 + 48 + 2 * ROW_H + ROW_H / 2;
const FIELD_Y = [110, 220, 330]; // body coords, label top
const INPUT_CY = (i: number) => BODY.y + FIELD_Y[i] + 32 + 32;
const SUBMIT = { x: 48, y: 450, w: 220, h: 64 };

const helperKeys: Key[] = [
  { f: FORM.helperIn, x: SHEET.x + SHEET.w - 110, y: NEW_ROW_CY },
  { f: FORM.helperIn + 6, x: SHEET.x + SHEET.w - 110, y: NEW_ROW_CY },
  { f: FORM.fields[0] - 4, x: BODY.x + 700, y: INPUT_CY(0) },
  { f: FORM.fields[1] - 4, x: BODY.x + 700, y: INPUT_CY(0) },
  { f: FORM.fields[1], x: BODY.x + 700, y: INPUT_CY(1) },
  { f: FORM.fields[2] - 4, x: BODY.x + 700, y: INPUT_CY(1) },
  { f: FORM.fields[2], x: BODY.x + 700, y: INPUT_CY(2) },
  { f: FORM.submit - 6, x: BODY.x + 700, y: INPUT_CY(2) },
  { f: FORM.submit, x: BODY.x + SUBMIT.x + SUBMIT.w + 120, y: BODY.y + SUBMIT.y + SUBMIT.h / 2 },
  { f: FORM.sent + 8, x: BODY.x + SUBMIT.x + SUBMIT.w + 120, y: BODY.y + SUBMIT.y + SUBMIT.h / 2 },
  { f: FORM.rowDone - 2, x: SHEET.x + SHEET.w - 110, y: NEW_ROW_CY },
];

const Cell: React.FC<{ children: React.ReactNode; strong?: boolean }> = ({ children, strong }) => (
  <div style={{ padding: "0 16px", whiteSpace: "nowrap", overflow: "hidden", fontSize: 21, color: strong ? C.text : C.sub }}>{children}</div>
);

const Sheet: React.FC = () => {
  const frame = useCurrentFrame();
  const typing = frame >= FORM.type[0] && frame < FORM.queued;
  const done = frame >= FORM.rowDone;
  const doneP = pop(frame, FORM.rowDone, 10);
  const glow = ramp(frame, FORM.rowDone, FORM.rowDone + 4) * (1 - ramp(frame, FORM.rowDone + 14, FORM.rowDone + 34));
  return (
    <Window
      title={
        <span>
          <span style={{ color: C.text, fontSize: 18 }}>{s.sheet}</span>
          <span style={{ color: C.faint }}> · {s.sheetApp}</span>
        </span>
      }
      style={{ left: SHEET.x, top: SHEET.y, width: SHEET.w, height: SHEET.h, opacity: enter(frame, 2) }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: COLS,
          height: 48,
          alignItems: "center",
          fontFamily: MONO,
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: C.faint,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {[...s.cols, "Status"].map((c) => (
          <div key={c} style={{ padding: "0 16px" }}>
            {c}
          </div>
        ))}
      </div>
      {s.rows.map((r) => (
        <div key={r[0]} style={{ display: "grid", gridTemplateColumns: COLS, alignItems: "center", height: ROW_H, borderBottom: `1px solid ${C.line}` }}>
          <Cell strong>{r[0]}</Cell>
          <Cell>{r[1]}</Cell>
          <Cell>{r[2]}</Cell>
          <div style={{ padding: "0 16px" }}>
            <Pill tone="accent" style={{ fontSize: 15 }}>
              <Check size={13} /> Sent
            </Pill>
          </div>
        </div>
      ))}
      {frame >= FORM.type[0] - 4 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            alignItems: "center",
            height: ROW_H,
            background: `rgba(195,236,110,${typing ? 0.06 : 0.1 * glow})`,
            boxShadow: typing || glow > 0 ? `inset 0 0 0 2px rgba(195,236,110,${typing ? 0.5 : 0.7 * glow})` : undefined,
          }}
        >
          {s.newRow.map((v, i) => {
            const n = typed(frame, v, FORM.type[i], 2.2);
            return (
              <Cell key={i} strong={i === 0}>
                {v.slice(0, n)}
                {frame >= FORM.type[i] && n < v.length ? <Caret h={20} /> : null}
              </Cell>
            );
          })}
          <div style={{ padding: "0 16px" }}>
            {done ? (
              <Pill tone="accent" style={{ fontSize: 15, transform: `scale(${0.6 + 0.4 * doneP})` }}>
                <Check size={13} /> Sent
              </Pill>
            ) : frame >= FORM.queued ? (
              <Pill tone="neutral" style={{ fontSize: 15 }}>
                New
              </Pill>
            ) : null}
          </div>
        </div>
      ) : null}
    </Window>
  );
};

/** "You" tag while the row is being typed, so it's clear who does step 1. */
const YouTag: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < FORM.type[0] - 2 || frame > FORM.queued + 2) return null;
  const p = pop(frame, FORM.type[0] - 2, 12) * (1 - ramp(frame, FORM.queued - 4, FORM.queued + 2));
  return (
    <div
      style={{
        position: "absolute",
        left: SHEET.x + SHEET.w - 110,
        top: NEW_ROW_CY,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * p})`,
        opacity: p,
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 48,
        padding: "0 18px 0 12px",
        borderRadius: 24,
        background: "#2F3440",
        border: `1px solid ${C.lineHi}`,
        fontFamily: FONT,
        fontSize: 22,
        fontWeight: 600,
        color: C.text,
        zIndex: 20,
      }}
    >
      <Person size={22} color={C.text} /> You
    </div>
  );
};

const Browser: React.FC = () => {
  const frame = useCurrentFrame();
  const sent = pop(frame, FORM.sent, 11);
  return (
    <Window title={<UrlBar url={s.url} />} style={{ left: BROWSER.x, top: BROWSER.y, width: BROWSER.w, height: BROWSER.h, opacity: enter(frame, 4) }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - Math.min(1, sent) }}>
        <div style={{ position: "absolute", left: 48, top: 36, fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.page}</div>
        {s.fields.map((f, i) => {
          const at = FORM.fields[i];
          const n = typed(frame, f.value, at, 3);
          const focus = frame >= at - 4 && frame < (FORM.fields[i + 1] ?? FORM.submit) - 4;
          return (
            <div key={f.label} style={{ position: "absolute", left: 48, top: FIELD_Y[i], width: 798 }}>
              <div style={{ fontSize: 20, color: C.muted, height: 26 }}>{f.label}</div>
              <div
                style={{
                  marginTop: 6,
                  height: 64,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  background: C.field,
                  border: `2px solid ${focus ? C.accent : n ? C.lineHi : C.line}`,
                  fontSize: 26,
                }}
              >
                {f.value.slice(0, n)}
                {focus && n < f.value.length ? <Caret h={26} /> : null}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: SUBMIT.x,
            top: SUBMIT.y,
            width: SUBMIT.w,
            height: SUBMIT.h,
            borderRadius: 14,
            background: frame >= FORM.submit ? C.accent : C.text,
            color: C.ink,
            fontSize: 24,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${frame >= FORM.submit && frame < FORM.submit + 5 ? 0.94 : 1})`,
          }}
        >
          {s.submit}
        </div>
      </div>
      {frame >= FORM.sent ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: Math.min(1, sent * 1.4) }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${sent})`,
            }}
          >
            <Check size={70} color={C.ink} stroke={2.6} />
          </div>
          <div style={{ marginTop: 28, fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.done}</div>
          <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 24, color: C.muted }}>{s.ref}</div>
        </div>
      ) : null}
    </Window>
  );
};

const Helper: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < FORM.helperIn) return null;
  const { x, y } = path(frame, helperKeys);
  const show = pop(frame, FORM.helperIn, 11) * (1 - ramp(frame, FORM.rowDone + 4, FORM.rowDone + 12));
  const working = frame >= FORM.fields[0] - 4 && frame < FORM.sent;
  return <HelperBadge x={x} y={y} label={copy.short.helper} show={show} working={working} />;
};

export const FormCase: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
    <KineticTitle index={s.index} label={s.label} title={s.title} size={76} />
    <Sheet />
    <Browser />
    <YouTag />
    <Helper />
    <StepsBar steps={s.steps} at={FORM.steps} doneAt={FORM.doneAt} />
  </AbsoluteFill>
);
