import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { copy } from "../copy/en";
import { C, FONT, MONO, PAD } from "../theme";
import { EASE, enter, ramp } from "../ui/anim";
import { AgentGlyph, Check, Hash, Person, Warn } from "../ui/icons";
import { Cursor, Pill, SceneHeader, ToolLine, TypeText, Window } from "../ui/primitives";

const t = copy.support;

/* ---- Layout ---- */
const STAGE_Y = 300;
const CHAT = { x: PAD, y: STAGE_Y, w: 640, h: 700 };
const SLACK = { x: 776, y: STAGE_Y, w: 1048, h: 580 };
const STATS = { x: 776, y: STAGE_Y + 610, w: 1048, h: 90 };
const MAIN = { x: SLACK.x + 1 + 220, y: SLACK.y + 49 }; // slack main pane origin
const CARD = { x: 84, y: 172, w: 700 };
const APPROVE = { x: 18, y: 220, w: 176, h: 44 };

/* ---- Timeline ---- */
const C1_MSG = 20;
const C1_TOOLS = [44, 60, 78];
const C1_REPLY = 98;
const SWITCH = 178;
const C2_MSG = 190;
const C2_TOOLS = [210, 228];
const C2_REPLY = 244;
const SLACK_MSG = 240;
const CLOCK: [number, number] = [282, 300];
const CLICK = 318;
const APPROVED_CHAT = 336;
const STATS_AT = 362;

/* ---------- Chat widget ---------- */

const Bubble: React.FC<{ side: "me" | "ai"; at: number; children: React.ReactNode; tone?: "accent" }> = ({ side, at, children, tone }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, at, 16);
  if (frame < at) return null;
  const me = side === "me";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: me ? "flex-end" : "flex-start",
        gap: 10,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 14}px) scale(${0.97 + 0.03 * p})`,
        transformOrigin: me ? "right bottom" : "left bottom",
      }}
    >
      {!me ? (
        <div
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 10,
            background: C.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <AgentGlyph size={17} color={C.ink} />
        </div>
      ) : null}
      <div
        style={{
          maxWidth: 440,
          padding: "13px 17px",
          borderRadius: 16,
          borderBottomRightRadius: me ? 4 : 16,
          borderTopLeftRadius: me ? 16 : 4,
          background: me ? "#2A2E35" : tone === "accent" ? C.accentDim : C.panelHi,
          border: `1px solid ${tone === "accent" ? "rgba(195,236,110,0.3)" : C.line}`,
          fontSize: 18,
          lineHeight: 1.42,
          color: C.text,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const TimeDivider: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 13, color: C.faint }}>
    <div style={{ flex: 1, height: 1, background: C.line }} />
    {text}
    <div style={{ flex: 1, height: 1, background: C.line }} />
  </div>
);

const Tools: React.FC<{ items: readonly { text: string; src: string }[]; starts: number[]; warnLast?: boolean }> = ({
  items,
  starts,
  warnLast,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingLeft: 42 }}>
      {items.map((it, i) => {
        if (frame < starts[i]) return null;
        const warn = warnLast && i === items.length - 1;
        return (
          <ToolLine
            key={i}
            text={it.text}
            src={it.src}
            start={starts[i]}
            done={starts[i] + 14}
            size={15}
            tone={warn ? "warn" : "accent"}
            doneIcon={warn ? <Warn size={15} color={C.warn} /> : undefined}
          />
        );
      })}
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const frame = useCurrentFrame();
  const out1 = ramp(frame, SWITCH, SWITCH + 12);
  const in2 = enter(frame, SWITCH + 6);
  const pulse = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 2);
  const col: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    padding: "22px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };
  return (
    <div
      style={{
        position: "absolute",
        left: CHAT.x,
        top: CHAT.y,
        width: CHAT.w,
        height: CHAT.h,
        borderRadius: 22,
        background: C.panel,
        border: `1px solid ${C.line}`,
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        overflow: "hidden",
        fontFamily: FONT,
        color: C.text,
      }}
    >
      <div
        style={{
          height: 80,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 22px",
          borderBottom: `1px solid ${C.line}`,
          background: C.panelHi,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "#E9E4D8",
            color: "#2A2620",
            fontWeight: 700,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          L
        </div>
        <div>
          <div style={{ fontSize: 19, fontWeight: 600 }}>{t.shop}</div>
          <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.muted }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: C.accent, opacity: 0.5 + 0.5 * pulse }} />
            {t.widgetTitle} · {t.online}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 80, left: 0, right: 0, bottom: 72, overflow: "hidden" }}>
        {/* conversation 1 */}
        <div style={{ ...col, opacity: 1 - out1, transform: `translateY(${-out1 * 60}px)` }}>
          <TimeDivider text={`Tonight · ${t.chat1.time}`} />
          <Bubble side="me" at={C1_MSG}>
            {t.chat1.customer}
          </Bubble>
          <Tools items={t.chat1.tools} starts={C1_TOOLS} />
          <Bubble side="ai" at={C1_REPLY}>
            <TypeText text={t.chat1.reply} start={C1_REPLY + 4} cpf={3.2} caretH={18} />
          </Bubble>
        </div>

        {/* conversation 2 */}
        {frame >= SWITCH ? (
          <div style={{ ...col, opacity: in2, transform: `translateY(${(1 - in2) * 60}px)` }}>
            <TimeDivider text={`Tonight · ${t.chat2.time}`} />
            <Bubble side="me" at={C2_MSG}>
              {t.chat2.customer}
            </Bubble>
            <Tools items={t.chat2.tools} starts={C2_TOOLS} warnLast />
            <Bubble side="ai" at={C2_REPLY}>
              <TypeText text={t.chat2.reply} start={C2_REPLY + 4} cpf={3.2} caretH={18} />
            </Bubble>
            {frame >= APPROVED_CHAT - 14 ? <TimeDivider text="Today · 8:52 AM" /> : null}
            <Bubble side="ai" at={APPROVED_CHAT} tone="accent">
              {t.chat2.approved}
            </Bubble>
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 14,
          height: 46,
          borderRadius: 12,
          background: C.field,
          border: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontSize: 16,
          color: C.faint,
        }}
      >
        Type a message…
      </div>
    </div>
  );
};

/* ---------- Slack ---------- */

const fmtClock = (mins: number) => {
  const h24 = Math.floor(mins / 60) % 24;
  const m = Math.floor(mins % 60);
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const Slack: React.FC = () => {
  const frame = useCurrentFrame();
  const msg = enter(frame, SLACK_MSG, 18);
  const mins = interpolate(frame, CLOCK, [3, 8 * 60 + 52], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const ff = frame > CLOCK[0] && frame < CLOCK[1];
  const approved = frame >= CLICK + 2;
  const press = frame >= CLICK && frame < CLICK + 6;
  const approvedLine = enter(frame, CLICK + 6);

  return (
    <Window
      title={<span style={{ color: C.text }}>{t.slack.workspace} · Slack</span>}
      right={
        <Pill tone={ff ? "accent" : "neutral"} style={{ minWidth: 104, justifyContent: "center" }}>
          {fmtClock(frame < CLOCK[0] ? 3 : mins)}
        </Pill>
      }
      style={{ left: SLACK.x, top: SLACK.y, width: SLACK.w, height: SLACK.h }}
    >
      {/* sidebar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 220,
          borderRight: `1px solid ${C.line}`,
          background: "rgba(255,255,255,0.015)",
          padding: "20px 12px",
        }}
      >
        <div style={{ fontSize: 13, fontFamily: MONO, color: C.faint, padding: "0 10px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Channels
        </div>
        {t.slack.channels.map((ch) => {
          const active = ch === t.slack.channel;
          return (
            <div
              key={ch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 36,
                padding: "0 10px",
                borderRadius: 8,
                fontSize: 16,
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
                color: active ? C.text : C.muted,
                fontWeight: active ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ display: "inline-flex", flexShrink: 0 }}><Hash color={active ? C.text : C.faint} /></span>
              {ch}
            </div>
          );
        })}
      </div>

      {/* main pane (origin = MAIN) */}
      <div style={{ position: "absolute", left: 220, top: 0, right: 0, bottom: 0 }}>
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 28px",
            borderBottom: `1px solid ${C.line}`,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          <Hash size={16} color={C.muted} /> {t.slack.channel}
        </div>

        {/* earlier human message */}
        <div style={{ position: "absolute", left: 28, top: 82, display: "flex", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#3A3530",
              color: "#E9E4D8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Person size={20} color="#E9E4D8" />
          </div>
          <div>
            <div style={{ fontSize: 16 }}>
              <b>Dana Whitlock</b> <span style={{ color: C.faint, fontFamily: MONO, fontSize: 13, marginLeft: 6 }}>5:40 PM</span>
            </div>
            <div style={{ marginTop: 4, fontSize: 16, color: C.sub }}>Heading off. The agent has support covered tonight.</div>
          </div>
        </div>

        {/* bot message */}
        {frame >= SLACK_MSG ? (
          <div style={{ opacity: msg, transform: `translateY(${(1 - msg) * 20}px)` }}>
            <div
              style={{
                position: "absolute",
                left: 28,
                top: 142,
                width: 40,
                height: 40,
                borderRadius: 10,
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AgentGlyph size={20} color={C.ink} />
            </div>
            <div style={{ position: "absolute", left: 84, top: 142, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <b>{t.slack.bot}</b>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  padding: "2px 5px",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.08)",
                  color: C.muted,
                }}
              >
                APP
              </span>
              <span style={{ color: C.faint, fontFamily: MONO, fontSize: 13 }}>{t.slack.botTime}</span>
            </div>
            <div
              style={{
                position: "absolute",
                left: CARD.x,
                top: CARD.y,
                width: CARD.w,
                height: 282,
                borderRadius: 12,
                background: C.panelHi,
                border: `1px solid ${C.line}`,
                borderLeft: `3px solid ${C.warn}`,
              }}
            >
              <div style={{ position: "absolute", left: 18, top: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 600 }}>
                <Warn size={18} color={C.warn} /> {t.slack.heading}
              </div>
              {t.slack.facts.map(([k, v], i) => (
                <div key={k} style={{ position: "absolute", left: 18, top: 58 + i * 31, display: "flex", fontSize: 16 }}>
                  <span style={{ width: 110, color: C.muted }}>{k}</span>
                  <span style={{ color: C.text }}>{v}</span>
                </div>
              ))}
              <div style={{ position: "absolute", left: 18, top: 186, fontSize: 16, color: C.accent }}>
                {t.slack.suggestion} · $189.00
              </div>
              <div
                style={{
                  position: "absolute",
                  left: APPROVE.x,
                  top: APPROVE.y,
                  width: APPROVE.w,
                  height: APPROVE.h,
                  borderRadius: 10,
                  background: approved ? C.accentDim : C.accent,
                  border: approved ? `1px solid ${C.accentLine}` : "none",
                  color: approved ? C.accent : C.ink,
                  fontWeight: 600,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transform: `scale(${press ? 0.96 : 1})`,
                }}
              >
                {approved ? <Check size={15} color={C.accent} /> : null}
                {approved ? "Approved" : t.slack.approve}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: APPROVE.x + APPROVE.w + 12,
                  top: APPROVE.y,
                  height: APPROVE.h,
                  padding: "0 18px",
                  borderRadius: 10,
                  border: `1px solid ${C.lineHi}`,
                  color: C.sub,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  opacity: approved ? 0.4 : 1,
                }}
              >
                {t.slack.reply}
              </div>
            </div>
            {approved ? (
              <div
                style={{
                  position: "absolute",
                  left: CARD.x,
                  top: CARD.y + 296,
                  fontFamily: MONO,
                  fontSize: 14,
                  color: C.muted,
                  opacity: approvedLine,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Check size={14} color={C.accent} /> {t.slack.approvedBy} · customer notified
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Window>
  );
};

/* ---------- Stats ---------- */

const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const box = enter(frame, STATS_AT - 6);
  return (
    <div
      style={{
        position: "absolute",
        left: STATS.x,
        top: STATS.y,
        width: STATS.w,
        height: STATS.h,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        borderRadius: 18,
        background: C.panel,
        border: `1px solid ${C.line}`,
        opacity: box,
        transform: `translateY(${(1 - box) * 20}px)`,
        fontFamily: FONT,
      }}
    >
      {t.stats.map((s, i) => {
        const v = Math.round(
          interpolate(frame, [STATS_AT + i * 6, STATS_AT + i * 6 + 30], [0, s.value], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
        );
        return (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 28px",
              borderLeft: i ? `1px solid ${C.line}` : "none",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 500, color: i === 0 ? C.accent : C.text }}>{v}</span>
            <span style={{ fontSize: 17, color: C.muted, lineHeight: 1.25 }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export const SupportAgent: React.FC = () => {
  const approveCenter = {
    x: MAIN.x + CARD.x + APPROVE.x + 70,
    y: MAIN.y + CARD.y + APPROVE.y + 18,
  };
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <SceneHeader index={t.index} label={t.label} title={t.title} />
      <ChatWidget />
      <Slack />
      <Stats />
      <Cursor
        keys={[
          { f: CLOCK[1] - 2, x: approveCenter.x + 260, y: approveCenter.y + 150 },
          { f: CLICK - 2, x: approveCenter.x, y: approveCenter.y },
        ]}
        clicks={[CLICK]}
        show={[CLOCK[1] - 2, CLICK + 24]}
      />
    </AbsoluteFill>
  );
};
