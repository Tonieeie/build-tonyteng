import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO } from "../theme";
import { EASE, enter, ramp } from "./anim";

/** A rendered invoice "PDF page" with scan line and field highlights. Coordinates are paper-relative. */

export const PAPER_W = 450;
export const PAPER_H = 610;

export const P_VENDOR = { x: 30, y: 44, w: 300, h: 30 };
export const META = [
  { x: 30, y: 100, label: "Invoice no.", key: "number" },
  { x: 240, y: 100, label: "Issued", key: "issued" },
  { x: 30, y: 148, label: "Due", key: "due" },
  { x: 240, y: 148, label: "Purchase order", key: "po" },
] as const;
export const P_TOTAL = { x: 230, y: 470, w: 196, h: 40 };

export type PdfData = typeof copy.invoice.pdf | typeof copy.invoice.pdf2;
export type Marks = { vendor: number; due: number; po: number; total: number };

export const Highlight: React.FC<{ box: { x: number; y: number; w: number; h: number }; at: number; tone?: "accent" | "warn" }> = ({
  box,
  at,
  tone = "accent",
}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, at, 18);
  const color = tone === "warn" ? "240,180,92" : "142,190,40";
  return (
    <div
      style={{
        position: "absolute",
        left: box.x - 8,
        top: box.y - 6,
        width: box.w + 16,
        height: box.h + 12,
        borderRadius: 8,
        background: `rgba(${color},${0.16 * p})`,
        border: `2px solid rgba(${color},${0.9 * p})`,
        transform: `scale(${1.08 - 0.08 * p})`,
      }}
    />
  );
};

export const Paper: React.FC<{ d: PdfData; scan: [number, number]; hl?: Marks; warnPo?: number; left?: number; top?: number }> = ({
  d,
  scan,
  hl,
  warnPo,
  left = 24,
  top = 20,
}) => {
  const frame = useCurrentFrame();
  const scanY = interpolate(frame, scan, [0, PAPER_H], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const scanOn = frame >= scan[0] && frame <= scan[1] + 6 ? 1 - ramp(frame, scan[1], scan[1] + 6) : 0;
  const ink = "#16181C";
  const soft = "#6B7079";
  const rule = "rgba(0,0,0,0.1)";
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: PAPER_W,
        height: PAPER_H,
        background: "#ECECE7",
        borderRadius: 6,
        color: ink,
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      {hl ? (
        <>
          <Highlight box={P_VENDOR} at={hl.vendor} />
          <Highlight box={{ x: META[2].x, y: META[2].y, w: 170, h: 40 }} at={hl.due} />
          <Highlight box={{ x: META[3].x, y: META[3].y, w: 170, h: 40 }} at={hl.po} />
          <Highlight box={P_TOTAL} at={hl.total} />
        </>
      ) : null}
      {warnPo !== undefined ? (
        <>
          <Highlight box={{ x: META[3].x, y: META[3].y, w: 170, h: 40 }} at={warnPo} tone="warn" />
          <Highlight box={P_TOTAL} at={warnPo} tone="warn" />
        </>
      ) : null}
      <div style={{ position: "absolute", left: P_VENDOR.x, top: P_VENDOR.y, fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em" }}>
        {d.vendor}
      </div>
      <div style={{ position: "absolute", left: 30, top: 20, fontFamily: MONO, fontSize: 12, letterSpacing: "0.1em", color: soft }}>
        TAX INVOICE
      </div>
      {META.map((m) => (
        <div key={m.key} style={{ position: "absolute", left: m.x, top: m.y }}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: soft }}>{m.label}</div>
          <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 16 }}>{d[m.key]}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 30, right: 30, top: 216 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 60px 110px",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: soft,
            paddingBottom: 8,
            borderBottom: `1px solid ${rule}`,
          }}
        >
          <span>Description</span>
          <span style={{ textAlign: "right" }}>Qty</span>
          <span style={{ textAlign: "right" }}>Amount</span>
        </div>
        {d.lines.map((l) => (
          <div
            key={l[0]}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 110px",
              fontSize: 14,
              padding: "11px 0",
              borderBottom: `1px solid ${rule}`,
            }}
          >
            <span>{l[0]}</span>
            <span style={{ textAlign: "right", fontFamily: MONO }}>{l[1]}</span>
            <span style={{ textAlign: "right", fontFamily: MONO }}>{l[2]}</span>
          </div>
        ))}
      </div>
      {[
        ["Subtotal", d.subtotal, 392],
        ["GST 10%", d.gst, 422],
      ].map(([k, v, y]) => (
        <div
          key={k as string}
          style={{ position: "absolute", left: 230, width: 196, top: y as number, display: "flex", justifyContent: "space-between", fontSize: 14, color: soft }}
        >
          <span>{k}</span>
          <span style={{ fontFamily: MONO, color: ink }}>{v}</span>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: P_TOTAL.x,
          top: P_TOTAL.y,
          width: P_TOTAL.w,
          height: P_TOTAL.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        <span>Total AUD</span>
        <span style={{ fontFamily: MONO, fontSize: 18 }}>{d.total}</span>
      </div>
      <div style={{ position: "absolute", left: 30, bottom: 28, fontSize: 12, color: soft }}>Pay by EFT within 14 days of issue.</div>

      {/* scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY - 60,
          height: 60,
          opacity: scanOn,
          background: "linear-gradient(to bottom, rgba(195,236,110,0), rgba(195,236,110,0.28))",
          borderBottom: `2px solid ${C.accent}`,
        }}
      />
    </div>
  );
};

