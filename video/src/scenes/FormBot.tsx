import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { enter, ramp, typed, type Key } from "../ui/anim";
import { AgentGlyph, Check, Chevron } from "../ui/icons";
import { Caret, Cursor, Pill, SceneHeader, ToolLine, TypeText, UrlBar, Window } from "../ui/primitives";

const t = copy.form;

/* ---- Layout (scene coordinates) ---- */
const STAGE_Y = 300;
const SHEET = { x: PAD, y: STAGE_Y, w: 740, h: 330 };
const CONSOLE = { x: PAD, y: STAGE_Y + 360, w: 740, h: 340 };
const BROWSER = { x: 896, y: STAGE_Y, w: 928, h: 700 };
const BODY = { x: BROWSER.x + 1, y: BROWSER.y + 49 }; // browser body origin

/* ---- Timeline (frames, local to scene) ---- */
const ROW_TYPE = [30, 50, 64];
const QUEUED_AT = 82;
const PICKED_AT = 92;
const PAGE_AT = 108;
const FIELD_AT = (i: number) => 128 + i * 26;
const CONSENT_AT = 250;
const SUBMIT_AT = 266;
const SUCCESS_AT = 274;
const DONE_AT = 300;
const NEXT_TYPE = [336, 354, 368];
const NEXT_QUEUED = 384;
const NEXT_PICKED = 394;

/* ---- Form geometry (body coordinates) ---- */
const FX = 44;
const COL_W = 408;
const GAP = 24;
const ROWS_Y = [150, 254, 358];
const fieldBox = (i: number) => {
  if (i === 4) return { x: FX, y: ROWS_Y[2], w: COL_W * 2 + GAP };
  return { x: FX + (i % 2) * (COL_W + GAP), y: ROWS_Y[Math.floor(i / 2)], w: COL_W };
};
const CONSENT = { x: FX, y: 462 };
const SUBMIT = { x: FX, y: 516, w: 270, h: 58 };

const cursorKeys = (): Key[] => {
  const targets: { f: number; x: number; y: number }[] = [
    ...t.fields.map((_, i) => {
      const b = fieldBox(i);
      return { f: FIELD_AT(i), x: BODY.x + b.x + b.w - 70, y: BODY.y + b.y + 44 };
    }),
    { f: CONSENT_AT, x: BODY.x + CONSENT.x + 8, y: BODY.y + CONSENT.y + 8 },
    { f: SUBMIT_AT, x: BODY.x + SUBMIT.x + 120, y: BODY.y + SUBMIT.y + 24 },
  ];
  const keys: Key[] = [{ f: FIELD_AT(0) - 14, x: BODY.x + 520, y: BODY.y + 420 }];
  targets.forEach((tg, i) => {
    const prev = i === 0 ? keys[0] : targets[i - 1];
    keys.push({ f: tg.f - 9, x: prev.x, y: prev.y });
    keys.push(tg);
  });
  return keys;
};

/* ---------- Sheet ---------- */

const SheetRow: React.FC<{
  n: number;
  cells: React.ReactNode[];
  status: React.ReactNode;
  highlight?: number;
  enterAt?: number;
}> = ({ n, cells, status, highlight = 0, enterAt }) => {
  const frame = useCurrentFrame();
  const p = enterAt === undefined ? 1 : enter(frame, enterAt);
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "44px 1.4fr 1.1fr 1.05fr 1.2fr",
        alignItems: "center",
        height: 54,
        borderBottom: `1px solid ${C.line}`,
        fontSize: 17,
        opacity: p,
        background: `rgba(195,236,110,${0.07 * highlight})`,
        boxShadow: highlight > 0 ? `inset 0 0 0 1.5px rgba(195,236,110,${0.6 * highlight})` : undefined,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 13, color: C.faint, textAlign: "center" }}>{n}</div>
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            padding: "0 12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            color: i === 0 ? C.text : C.sub,
            fontFamily: i === 2 ? MONO : FONT,
            fontSize: i === 2 ? 15 : 17,
          }}
        >
          {c}
        </div>
      ))}
      <div style={{ padding: "0 12px" }}>{status}</div>
    </div>
  );
};

const Sheet: React.FC = () => {
  const frame = useCurrentFrame();
  const typing = (text: string, start: number) => <TypeText text={text} start={start} cpf={1.3} caretH={18} />;
  const pick1 = ramp(frame, PICKED_AT, PICKED_AT + 6) * (1 - ramp(frame, PICKED_AT + 22, PICKED_AT + 36));
  const doneFlash = ramp(frame, DONE_AT, DONE_AT + 4) * (1 - ramp(frame, DONE_AT + 10, DONE_AT + 30));
  const pick2 = ramp(frame, NEXT_PICKED, NEXT_PICKED + 6);

  const status1 =
    frame >= DONE_AT ? (
      <Pill tone="accent">
        <Check size={13} /> {t.doneAt.replace("Done · ", "")}
      </Pill>
    ) : frame >= QUEUED_AT ? (
      <Pill tone="neutral">{t.queued}</Pill>
    ) : null;

  return (
    <Window
      title={
        <span>
          <span style={{ color: C.text }}>{t.sheetName}</span>
          <span style={{ color: C.faint }}> · Google Sheet</span>
        </span>
      }
      style={{ left: SHEET.x, top: SHEET.y, width: SHEET.w, height: SHEET.h }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "44px 1.4fr 1.1fr 1.05fr 1.2fr",
          height: 40,
          alignItems: "center",
          fontFamily: MONO,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: C.faint,
          borderBottom: `1px solid ${C.line}`,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div />
        {t.columns.map((c) => (
          <div key={c} style={{ padding: "0 12px" }}>
            {c}
          </div>
        ))}
      </div>
      {t.doneRows.map((r, i) => (
        <SheetRow
          key={i}
          n={i + 1}
          cells={r.slice(0, 3)}
          status={
            <Pill tone="accent">
              <Check size={13} /> {r[3].replace("Done · ", "")}
            </Pill>
          }
        />
      ))}
      {frame >= ROW_TYPE[0] - 6 ? (
        <SheetRow
          n={3}
          enterAt={ROW_TYPE[0] - 6}
          highlight={Math.max(pick1, doneFlash)}
          cells={t.newRow.map((v, i) => typing(v, ROW_TYPE[i]))}
          status={status1}
        />
      ) : null}
      {frame >= NEXT_TYPE[0] - 6 ? (
        <SheetRow
          n={4}
          enterAt={NEXT_TYPE[0] - 6}
          highlight={pick2}
          cells={t.nextRow.map((v, i) => typing(v, NEXT_TYPE[i]))}
          status={frame >= NEXT_QUEUED ? <Pill tone="neutral">{t.queued}</Pill> : null}
        />
      ) : null}
    </Window>
  );
};

/* ---------- Agent console ---------- */

const LOG_TIMES: [number, number][] = [
  [PICKED_AT, PICKED_AT + 10],
  [PAGE_AT, PAGE_AT + 16],
  [FIELD_AT(0), CONSENT_AT + 4],
  [SUBMIT_AT + 2, SUCCESS_AT + 16],
  [DONE_AT - 4, DONE_AT + 6],
  [NEXT_PICKED, NEXT_PICKED + 12],
];

const Console: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 2);
  return (
    <Window
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: C.text }}>
          <AgentGlyph color={C.accent} /> {t.agentName}
        </span>
      }
      right={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: MONO, fontSize: 15, color: C.muted }}>{t.clock}</span>
          <Pill tone="accent">{t.agentTag}</Pill>
        </div>
      }
      style={{ left: CONSOLE.x, top: CONSOLE.y, width: CONSOLE.w, height: CONSOLE.h }}
      bodyStyle={{ padding: "22px 24px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 15, color: C.muted }}>
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            background: C.accent,
            opacity: 0.45 + 0.55 * pulse,
            boxShadow: `0 0 0 ${4 * pulse}px rgba(195,236,110,0.15)`,
          }}
        />
        {t.watching}
      </div>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 11 }}>
        {t.log.map((line, i) =>
          frame >= LOG_TIMES[i][0] ? (
            <ToolLine key={i} text={line} start={LOG_TIMES[i][0]} done={LOG_TIMES[i][1]} size={16} />
          ) : null,
        )}
      </div>
    </Window>
  );
};

/* ---------- Browser + form ---------- */

const Field: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const f = t.fields[i];
  const b = fieldBox(i);
  const at = FIELD_AT(i);
  const focus = frame >= at && frame < FIELD_AT(i + 1);
  const isSelect = i === 4;
  const n = isSelect ? (frame >= at + 8 ? f.value.length : 0) : typed(frame, f.value, at + 5, 1.6);
  const typing = !isSelect && frame >= at + 5 && n < f.value.length;
  const filled = n === f.value.length;
  return (
    <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w }}>
      <div style={{ fontSize: 15, color: C.muted, height: 20 }}>{f.label}</div>
      <div
        style={{
          marginTop: 8,
          height: 54,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: C.field,
          border: `1.5px solid ${focus ? C.accent : filled ? C.lineHi : C.line}`,
          boxShadow: focus ? "0 0 0 4px rgba(195,236,110,0.12)" : undefined,
          fontSize: 19,
          color: C.text,
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>
          {f.value.slice(0, n)}
          {typing ? <Caret h={20} /> : null}
        </span>
        {isSelect ? <Chevron color={C.muted} /> : null}
      </div>
    </div>
  );
};

const Browser: React.FC = () => {
  const frame = useCurrentFrame();
  const load = ramp(frame, PAGE_AT - 4, PAGE_AT + 14);
  const page = enter(frame, PAGE_AT + 6);
  const success = enter(frame, SUCCESS_AT, 16);
  const consent = frame >= CONSENT_AT + 2;
  const press = frame >= SUBMIT_AT && frame < SUBMIT_AT + 6;

  return (
    <Window
      title={<UrlBar url={frame >= PAGE_AT - 4 ? t.url : "about:blank"} />}
      style={{ left: BROWSER.x, top: BROWSER.y, width: BROWSER.w, height: BROWSER.h }}
    >
      {/* load bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 2,
          width: `${load * 100}%`,
          background: C.accent,
          opacity: 1 - ramp(frame, PAGE_AT + 14, PAGE_AT + 22),
        }}
      />
      <div style={{ position: "absolute", inset: 0, opacity: page * (1 - success), transform: `translateY(${(1 - page) * 12}px)` }}>
        <div style={{ position: "absolute", left: FX, top: 42, fontFamily: MONO, fontSize: 15, color: C.muted }}>{t.pageSub}</div>
        <div style={{ position: "absolute", left: FX, top: 70, fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em" }}>
          {t.pageTitle}
        </div>
        {t.fields.map((_, i) => (
          <Field key={i} i={i} />
        ))}
        <div
          style={{
            position: "absolute",
            left: CONSENT.x,
            top: CONSENT.y,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 17,
            color: C.sub,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: `1.5px solid ${consent ? C.accent : C.lineHi}`,
              background: consent ? C.accent : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {consent ? <Check size={14} color={C.ink} stroke={2.4} /> : null}
          </div>
          {t.consent}
        </div>
        <div
          style={{
            position: "absolute",
            left: SUBMIT.x,
            top: SUBMIT.y,
            width: SUBMIT.w,
            height: SUBMIT.h,
            borderRadius: 12,
            background: C.text,
            color: C.ink,
            fontSize: 18,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${press ? 0.97 : 1})`,
          }}
        >
          {t.submit}
        </div>
      </div>

      {/* success state */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: success,
          transform: `scale(${0.96 + success * 0.04})`,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            background: C.accentDim,
            border: `1.5px solid ${C.accentLine}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={40} color={C.accent} stroke={2.4} />
        </div>
        <div style={{ marginTop: 28, fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>{t.success}</div>
        <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 18, color: C.muted }}>{t.successRef}</div>
      </div>
    </Window>
  );
};

export const FormBot: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
    <SceneHeader index={t.index} label={t.label} title={t.title} />
    <Sheet />
    <Console />
    <Browser />
    <Cursor keys={cursorKeys()} clicks={[FIELD_AT(4), CONSENT_AT, SUBMIT_AT]} show={[FIELD_AT(0) - 14, SUCCESS_AT + 6]} />
  </AbsoluteFill>
);
