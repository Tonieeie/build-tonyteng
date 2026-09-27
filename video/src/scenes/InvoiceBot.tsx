import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { EASE, enter, ramp } from "../ui/anim";
import { AgentGlyph, Check, Clip, Doc, Warn } from "../ui/icons";
import { META, P_TOTAL, P_VENDOR, Paper } from "../ui/Invoice";
import { Pill, SceneHeader, Toast, ToolLine, Window } from "../ui/primitives";

const t = copy.invoice;

/* ---- Layout ---- */
const STAGE_Y = 300;
const INBOX = { x: PAD, y: STAGE_Y, w: 520, h: 440 };
const CONSOLE = { x: PAD, y: STAGE_Y + 470, w: 520, h: 230 };
const PDF = { x: 646, y: STAGE_Y, w: 500, h: 700 };
const LEDGER = { x: 1176, y: STAGE_Y, w: 648, h: 440 };
const PAPER = { x: PDF.x + 1 + 24, y: PDF.y + 49 + 20, w: 450, h: 610 };

/* ---- Timeline ---- */
const MAIL1 = 24;
const SELECT1 = 44;
const DOC1 = 52;
const SCAN1: [number, number] = [66, 126];
const HL = { vendor: 72, due: 88, po: 96, total: 116 };
const FLY = 132; // chips start flying
const FLY_DUR = 22;
const LOGGED1 = 170;
const MAIL2 = 200;
const SELECT2 = 212;
const DOC2 = 218;
const SCAN2: [number, number] = [222, 250];
const FLAG_ROW = 256;
const TOAST = 266;

/* ---- Ledger geometry ---- */
const COLS = "1.6fr 1fr 0.8fr 0.9fr 1fr";
const COL_X = [0, 196, 318, 416, 526];
const HEAD_H = 40;
const ROW_H = 54;
const ledgerRowY = (i: number) => LEDGER.y + 49 + HEAD_H + i * ROW_H;


/* ---------- Inbox ---------- */

const MailRow: React.FC<{
  from: string;
  subject: string;
  time: string;
  attach: boolean;
  unread?: boolean;
  selected?: number;
  grow?: number;
}> = ({ from, subject, time, attach, unread, selected = 0, grow = 1 }) => (
  <div style={{ height: 76 * grow, overflow: "hidden", flexShrink: 0 }}>
    <div
      style={{
        position: "relative",
        height: 76,
        padding: "14px 20px 0 34px",
        borderBottom: `1px solid ${C.line}`,
        background: `rgba(195,236,110,${0.07 * selected})`,
        opacity: grow,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: C.accent, opacity: selected }} />
      {unread ? (
        <div style={{ position: "absolute", left: 15, top: 22, width: 8, height: 8, borderRadius: 4, background: C.accent }} />
      ) : null}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 17, fontWeight: unread ? 600 : 500, color: unread ? C.text : C.sub }}>{from}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, color: C.faint }}>{time}</span>
      </div>
      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: C.muted }}>
        {attach ? <Clip size={14} color={C.muted} /> : null}
        {subject}
      </div>
    </div>
  </div>
);

const Inbox: React.FC = () => {
  const frame = useCurrentFrame();
  const g1 = enter(frame, MAIL1);
  const g2 = enter(frame, MAIL2);
  const sel1 = ramp(frame, SELECT1, SELECT1 + 6) * (1 - ramp(frame, SELECT2, SELECT2 + 6));
  const sel2 = ramp(frame, SELECT2, SELECT2 + 6);
  return (
    <Window
      title={<span style={{ color: C.text }}>{t.inboxTitle}</span>}
      right={<span style={{ fontFamily: MONO, fontSize: 14, color: C.faint }}>accounts@</span>}
      style={{ left: INBOX.x, top: INBOX.y, width: INBOX.w, height: INBOX.h }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {frame >= MAIL2 ? <MailRow {...t.secondEmail} unread={frame < SELECT2 + 20} selected={sel2} grow={g2} /> : null}
        {frame >= MAIL1 ? <MailRow {...t.emails[0]} unread={frame < SELECT1 + 20} selected={sel1} grow={g1} /> : null}
        {t.emails.slice(1).map((e) => (
          <MailRow key={e.subject} {...e} />
        ))}
      </div>
    </Window>
  );
};

/* ---------- Console ---------- */

const LOG: [number, number, "accent" | "warn"][] = [
  [DOC1, DOC1 + 14, "accent"],
  [SCAN1[0], SCAN1[1], "accent"],
  [FLY + 10, LOGGED1, "accent"],
  [DOC2, SCAN2[1], "accent"],
  [SCAN2[1] + 2, FLAG_ROW + 4, "warn"],
];

const Console: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Window
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: C.text }}>
          <AgentGlyph color={C.accent} /> Agent
        </span>
      }
      right={<Pill tone="accent">24/7</Pill>}
      style={{ left: CONSOLE.x, top: CONSOLE.y, width: CONSOLE.w, height: CONSOLE.h }}
      bodyStyle={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 9 }}
    >
      {t.log.map((line, i) =>
        frame >= LOG[i][0] ? (
          <ToolLine
            key={i}
            text={line}
            start={LOG[i][0]}
            done={LOG[i][1]}
            tone={LOG[i][2]}
            size={15}
            doneIcon={LOG[i][2] === "warn" ? <Warn size={15} color={C.warn} /> : undefined}
          />
        ) : null,
      )}
    </Window>
  );
};

/* ---------- PDF ---------- */

const PdfViewer: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = enter(frame, DOC1);
  const swap = ramp(frame, DOC2 - 4, DOC2 + 4);
  const d2 = enter(frame, DOC2);
  const name = frame >= DOC2 ? `${t.pdf2.number}.pdf` : frame >= DOC1 ? `${t.pdf.number}.pdf` : "";
  return (
    <Window
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Doc size={16} color={C.muted} />
          <span style={{ color: C.text }}>{name || "No document"}</span>
        </span>
      }
      right={frame >= SCAN1[0] ? <Pill tone={frame >= DOC2 ? "warn" : "accent"}>{frame >= DOC2 ? "INV-2297" : t.scanLabel}</Pill> : null}
      style={{ left: PDF.x, top: PDF.y, width: PDF.w, height: PDF.h }}
      bodyStyle={{ background: C.field }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: d1 * (1 - swap), transform: `translateY(${(1 - d1) * 30}px)` }}>
        <Paper d={t.pdf} scan={SCAN1} hl={HL} />
      </div>
      {frame >= DOC2 - 4 ? (
        <div style={{ position: "absolute", inset: 0, opacity: d2, transform: `translateX(${(1 - d2) * 40}px)` }}>
          <Paper d={t.pdf2} scan={SCAN2} warnPo={SCAN2[1] - 2} />
        </div>
      ) : null}
    </Window>
  );
};

/* ---------- Ledger ---------- */

const Cells: React.FC<{ row: readonly string[]; show: (i: number) => number; status: React.ReactNode }> = ({ row, show, status }) => (
  <>
    {row.slice(0, 4).map((v, i) => (
      <div
        key={i}
        style={{
          padding: "0 12px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          opacity: show(i),
          fontFamily: i === 0 ? FONT : MONO,
          fontSize: i === 0 ? 16 : 15,
          color: i === 0 ? C.text : C.sub,
        }}
      >
        {v}
      </div>
    ))}
    <div style={{ padding: "0 12px" }}>{status}</div>
  </>
);

const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const landed = (i: number) => ramp(frame, FLY + i * 5 + FLY_DUR - 2, FLY + i * 5 + FLY_DUR + 4);
  const flash1 = ramp(frame, LOGGED1 - 4, LOGGED1) * (1 - ramp(frame, LOGGED1 + 8, LOGGED1 + 30));
  const flagP = enter(frame, FLAG_ROW);
  const total = interpolate(frame, [LOGGED1, LOGGED1 + 24], [t.totalBefore, t.totalAfter], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const rowStyle = (bg: string): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: COLS,
    alignItems: "center",
    height: ROW_H,
    borderBottom: `1px solid ${C.line}`,
    background: bg,
  });
  return (
    <Window
      title={
        <span>
          <span style={{ color: C.text }}>{t.ledgerTitle}</span>
          <span style={{ color: C.faint }}> · Xero</span>
        </span>
      }
      style={{ left: LEDGER.x, top: LEDGER.y, width: LEDGER.w, height: LEDGER.h }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: COLS,
          height: HEAD_H,
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
        {t.ledgerCols.map((c) => (
          <div key={c} style={{ padding: "0 12px" }}>
            {c}
          </div>
        ))}
      </div>
      {t.ledgerRows.map((r) => (
        <div key={r[0]} style={rowStyle("transparent")}>
          <Cells
            row={r}
            show={() => 1}
            status={
              <Pill tone="accent">
                <Check size={13} /> {r[4]}
              </Pill>
            }
          />
        </div>
      ))}
      {frame >= FLY - 6 ? (
        <div style={{ ...rowStyle(`rgba(195,236,110,${0.04 + 0.08 * flash1})`), opacity: enter(frame, FLY - 6) }}>
          <Cells
            row={t.newRow}
            show={landed}
            status={
              frame >= LOGGED1 ? (
                <Pill tone="accent">
                  <Check size={13} /> {t.newRow[4]}
                </Pill>
              ) : null
            }
          />
        </div>
      ) : null}
      {frame >= FLAG_ROW ? (
        <div style={{ ...rowStyle(`rgba(240,180,92,${0.07 * flagP})`), opacity: flagP, transform: `translateY(${(1 - flagP) * 10}px)` }}>
          <Cells
            row={t.flaggedRow}
            show={() => 1}
            status={
              <Pill tone="warn">
                <Warn size={13} /> {t.flaggedRow[4]}
              </Pill>
            }
          />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 64,
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${C.line}`,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ fontSize: 16, color: C.muted }}>{t.totalLabel}</span>
        <span style={{ fontFamily: MONO, fontSize: 22, color: C.text }}>
          ${total.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </Window>
  );
};

/* ---------- Flying chips ---------- */

const CHIPS = [
  { value: t.newRow[0], from: P_VENDOR, col: 0 },
  { value: t.newRow[1], from: P_TOTAL, col: 1 },
  { value: t.newRow[2], from: { x: META[2].x, y: META[2].y }, col: 2 },
  { value: t.newRow[3], from: { x: META[3].x, y: META[3].y }, col: 3 },
];

const Chips: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {CHIPS.map((c, i) => {
        const s = FLY + i * 5;
        if (frame < s || frame > s + FLY_DUR + 4) return null;
        const p = interpolate(frame, [s, s + FLY_DUR], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE,
        });
        const x0 = PAPER.x + c.from.x;
        const y0 = PAPER.y + c.from.y;
        const x1 = LEDGER.x + 1 + COL_X[c.col] + 8;
        const y1 = ledgerRowY(2) + 12;
        const x = x0 + (x1 - x0) * p;
        const y = y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * 60;
        const fadeOut = 1 - ramp(frame, s + FLY_DUR - 2, s + FLY_DUR + 4);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              zIndex: 12,
              opacity: fadeOut,
              padding: "5px 10px",
              borderRadius: 8,
              background: C.accent,
              color: C.ink,
              fontFamily: i === 0 ? FONT : MONO,
              fontWeight: 600,
              fontSize: 15,
              whiteSpace: "nowrap",
              boxShadow: "0 12px 30px -10px rgba(0,0,0,0.6)",
            }}
          >
            {c.value}
          </div>
        );
      })}
    </>
  );
};

export const InvoiceBot: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
    <SceneHeader index={t.index} label={t.label} title={t.title} />
    <Inbox />
    <Console />
    <PdfViewer />
    <Ledger />
    <Chips />
    <Toast
      start={TOAST}
      tone="warn"
      icon={<Warn size={22} color={C.warn} />}
      title={t.toastTitle}
      body={t.toastBody}
      style={{ left: LEDGER.x, top: LEDGER.y + LEDGER.h + 34, width: LEDGER.w }}
    />
  </AbsoluteFill>
);
