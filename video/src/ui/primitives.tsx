import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, MONO, PAD } from "../theme";
import { enter, path, ramp, typed, type Key } from "./anim";
import { Check, Lock, Spinner } from "./icons";

/* ---------- Windows ---------- */

type WindowProps = {
  title?: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Window: React.FC<WindowProps> = ({ title, right, style, bodyStyle, children }) => (
  <div
    style={{
      position: "absolute",
      background: C.panel,
      border: `1px solid ${C.line}`,
      borderRadius: 18,
      boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: FONT,
      color: C.text,
      ...style,
    }}
  >
    <div
      style={{
        height: 48,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 18px",
        borderBottom: `1px solid ${C.line}`,
        background: C.panelHi,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: "rgba(255,255,255,0.13)" }} />
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0, fontSize: 16, color: C.muted, fontWeight: 500 }}>{title}</div>
      {right}
    </div>
    <div style={{ flex: 1, position: "relative", minHeight: 0, ...bodyStyle }}>{children}</div>
  </div>
);

export const UrlBar: React.FC<{ url: string }> = ({ url }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: 30,
      padding: "0 14px",
      borderRadius: 8,
      background: C.field,
      border: `1px solid ${C.line}`,
      fontFamily: MONO,
      fontSize: 14,
      color: C.sub,
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    <Lock color={C.muted} />
    {url}
  </div>
);

/* ---------- Text ---------- */

export const Caret: React.FC<{ color?: string; h?: number }> = ({ color = C.accent, h = 22 }) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: h,
        marginLeft: 2,
        verticalAlign: "middle",
        background: color,
        opacity: on ? 1 : 0,
      }}
    />
  );
};

/** Typewriter text. Shows a caret while typing if `caret`. */
export const TypeText: React.FC<{
  text: string;
  start: number;
  cpf?: number;
  caret?: boolean;
  caretH?: number;
}> = ({ text, start, cpf = 1.4, caret = true, caretH }) => {
  const frame = useCurrentFrame();
  const n = typed(frame, text, start, cpf);
  const typing = frame >= start && n < text.length;
  return (
    <>
      {text.slice(0, n)}
      {caret && typing ? <Caret h={caretH} /> : null}
    </>
  );
};

/* ---------- Cursor ---------- */

export const Cursor: React.FC<{ keys: Key[]; clicks?: number[]; show?: [number, number] }> = ({
  keys,
  clicks = [],
  show = [keys[0].f, Infinity],
}) => {
  const frame = useCurrentFrame();
  const { x, y } = path(frame, keys);
  const press = clicks.reduce((acc, c) => {
    const d = frame - c;
    return d >= 0 && d < 8 ? Math.max(acc, 1 - Math.abs(d - 3) / 4) : acc;
  }, 0);
  const vis = ramp(frame, show[0], show[0] + 6) * (1 - ramp(frame, show[1], show[1] + 6));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: vis,
        transform: `scale(${1 - press * 0.15})`,
        transformOrigin: "4px 4px",
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))",
        zIndex: 20,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24">
        <path d="M4 3l6.5 17 2.4-7.1L20 10.5 4 3z" fill={C.text} stroke={C.ink} strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
      {clicks.map((c) => {
        const d = frame - c;
        if (d < 0 || d > 16) return null;
        const r = ramp(frame, c, c + 16);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: 5 - 22 * r,
              top: 5 - 22 * r,
              width: 44 * r,
              height: 44 * r,
              borderRadius: "50%",
              border: `2px solid ${C.accent}`,
              opacity: 1 - r,
            }}
          />
        );
      })}
    </div>
  );
};

/* ---------- Pills & lines ---------- */

export const Pill: React.FC<{ tone: "neutral" | "accent" | "warn"; children: React.ReactNode; style?: React.CSSProperties }> = ({
  tone,
  children,
  style,
}) => {
  const map = {
    neutral: { bg: "rgba(255,255,255,0.06)", fg: C.muted, bd: C.line },
    accent: { bg: C.accentDim, fg: C.accent, bd: "rgba(195,236,110,0.3)" },
    warn: { bg: C.warnDim, fg: C.warn, bd: "rgba(240,180,92,0.3)" },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 28,
        padding: "0 10px",
        borderRadius: 999,
        background: map.bg,
        color: map.fg,
        border: `1px solid ${map.bd}`,
        fontFamily: MONO,
        fontSize: 14,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** An agent action line: spinner while running, check when done. */
export const ToolLine: React.FC<{
  text: string;
  src?: string;
  start: number;
  done: number;
  tone?: "accent" | "warn";
  size?: number;
  doneIcon?: React.ReactNode;
}> = ({ text, src, start, done, tone = "accent", size = 16, doneIcon }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start);
  const isDone = frame >= done;
  const color = tone === "warn" ? C.warn : C.accent;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: MONO,
        fontSize: size,
        color: isDone ? C.sub : C.muted,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 18, display: "inline-flex", justifyContent: "center" }}>
        {isDone ? doneIcon ?? <Check size={16} color={color} /> : <Spinner size={15} color={C.muted} turn={(frame % 24) / 24} />}
      </span>
      <span style={{ color: isDone && tone === "warn" ? C.warn : undefined }}>{text}</span>
      {src ? <span style={{ color: C.faint }}>· {src}</span> : null}
    </div>
  );
};

/* ---------- Scene header ---------- */

export const SceneHeader: React.FC<{ index?: string; label: string; title: string; titleWidth?: number }> = ({
  index,
  label,
  title,
  titleWidth = 1728,
}) => {
  const frame = useCurrentFrame();
  const words = title.split(" ");
  const lp = enter(frame, 2);
  return (
    <div style={{ position: "absolute", left: PAD, top: 92, width: titleWidth, fontFamily: FONT }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: MONO,
          fontSize: 18,
          letterSpacing: "0.04em",
          color: C.muted,
          opacity: lp,
          transform: `translateX(${(1 - lp) * -16}px)`,
          textTransform: "uppercase",
        }}
      >
        {index ? <span style={{ color: C.accent }}>{index}</span> : null}
        {index ? <span style={{ width: 28, height: 1, background: C.lineHi }} /> : null}
        <span>{label}</span>
      </div>
      <div
        style={{
          marginTop: 18,
          fontSize: 52,
          lineHeight: 1.1,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          textWrap: "balance",
          color: C.text,
        }}
      >
        {words.map((w, i) => {
          const p = enter(frame, 6 + i * 1.6);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.26em",
                opacity: p,
                transform: `translateY(${(1 - p) * 24}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Toast ---------- */

export const Toast: React.FC<{
  start: number;
  icon: React.ReactNode;
  title: string;
  body: string;
  tone?: "accent" | "warn";
  style?: React.CSSProperties;
}> = ({ start, icon, title, body, tone = "accent", style }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 14);
  const color = tone === "warn" ? C.warn : C.accent;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        gap: 14,
        padding: "18px 22px",
        width: 520,
        borderRadius: 16,
        background: C.panelHi,
        border: `1px solid ${C.lineHi}`,
        borderLeft: `3px solid ${color}`,
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.8)",
        fontFamily: FONT,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 30}px) scale(${0.96 + p * 0.04})`,
        zIndex: 15,
        ...style,
      }}
    >
      <div style={{ color, marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.text }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 17, lineHeight: 1.4, color: C.sub }}>{body}</div>
      </div>
    </div>
  );
};

/** Mounts children with a rise-in at `start`. */
export const Rise: React.FC<{ start: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  start,
  y = 24,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style }}>{children}</div>;
};
