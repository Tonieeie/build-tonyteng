import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { END } from "./EndSlogan";
import { FORM } from "./FormCase";
import { RCPT } from "./ReceiptCase";
import { MUG, WEB } from "./WebCase";

// Sound design for the 30s cut. Files come from scripts/audio.mjs (all synthesised, no samples).
// Cue frames are scene-local and mirror the timeline constants in each src/short/*.tsx scene.

type Sfx = "riser" | "impact" | "shatter" | "whoosh" | "slap" | "type" | "tick" | "check" | "pop" | "chime" | "warn" | "blip" | "scan" | "pour";
type Cue = [frame: number, sfx: Sfx, volume: number];

const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let f = from; f <= to; f += step) out.push(Math.round(f));
  return out;
};

const SMASH: Cue[] = [
  ...range(0, 15, 1).map((i): Cue => [Math.round(2 + i * 2.1), "slap", 0.18]),
  [2, "riser", 0.4],
  [45, "impact", 0.55],
  [45, "shatter", 0.45],
  [55, "pop", 0.16],
  [58, "pop", 0.16],
  [61, "pop", 0.16],
];

// Each step lighting up in the caption bar gets a soft tick.
const stepTicks = (at: number[]): Cue[] => at.map((f): Cue => [f, "tick", 0.22]);

const FORM_CUES: Cue[] = [
  ...stepTicks(FORM.steps),
  ...[...range(FORM.type[0], FORM.type[0] + 8, 2), ...range(FORM.type[1], FORM.type[1] + 5, 2), ...range(FORM.type[2], FORM.type[2] + 9, 2)].map(
    (f): Cue => [f, "type", 0.15],
  ),
  [FORM.helperIn, "pop", 0.4],
  [FORM.helperIn + 8, "whoosh", 0.25],
  ...FORM.fields.flatMap((f): Cue[] => [
    [f, "type", 0.16],
    [f + 3, "type", 0.14],
    [f + 6, "type", 0.14],
  ]),
  [FORM.submit, "slap", 0.3],
  [FORM.sent, "chime", 0.45],
  [FORM.rowDone, "check", 0.4],
];

const WEB_CUES: Cue[] = [
  ...stepTicks(WEB.steps),
  [WEB.photo, "pop", 0.35],
  ...WEB.notes.flatMap((f): Cue[] => [
    [f, "type", 0.15],
    [f + 3, "type", 0.13],
  ]),
  [WEB.nav, "tick", 0.25],
  [WEB.mugFly[0], "whoosh", 0.35],
  [MUG.appear, "pop", 0.4],
  [MUG.push[0], "whoosh", 0.45],
  [MUG.pour[0], "pour", 0.6],
  [MUG.pull[0], "whoosh", 0.35],
  [WEB.headline, "pop", 0.25],
  [WEB.cta, "pop", 0.3],
  ...WEB.features.map((f): Cue => [f, "tick", 0.22]),
  [WEB.review, "tick", 0.2],
  ...WEB.gauges.map((f): Cue => [f + 14, "check", 0.35]),
  [WEB.search, "chime", 0.4],
];

const RECEIPT_CUES: Cue[] = [
  ...stepTicks(RCPT.steps),
  [RCPT.paper, "slap", 0.2],
  [RCPT.snap, "impact", 0.12],
  [RCPT.snap, "tick", 0.4],
  [RCPT.helperIn, "pop", 0.4],
  [RCPT.scan[0], "scan", 0.35],
  ...RCPT.marks.map((f): Cue => [f, "tick", 0.2]),
  ...RCPT.fly.map((f): Cue => [f, "pop", 0.28]),
  [RCPT.category, "tick", 0.25],
  [RCPT.photo, "pop", 0.25],
  [RCPT.saved, "check", 0.42],
  [RCPT.sync, "whoosh", 0.3],
  [RCPT.synced, "chime", 0.4],
];

const CONNECT_CUES: Cue[] = [
  [2, "pop", 0.4],
  ...range(0, 7, 1).map((i): Cue => [Math.round(4 + i * 1.5), "blip", 0.2]),
  ...range(18, 46, 8).map((f): Cue => [f, "tick", 0.14]),
];

const PAY: Cue[] = [
  [6, "pop", 0.4],
  [14, "pop", 0.4],
  [22, "pop", 0.4],
  [28, "check", 0.35],
];

const END_CUES: Cue[] = [
  [END.line1, "pop", 0.3],
  [END.line1 + 3, "pop", 0.3],
  [END.line2, "pop", 0.35],
  [END.line2 + 3, "pop", 0.35],
  ...range(END.url, END.url + 8, 1).map((f): Cue => [f, "type", 0.18]),
  [END.url + 10, "chime", 0.35],
];

export type SceneStarts = Record<"smash" | "form" | "web" | "receipts" | "connect" | "pay" | "end", number>;

const MUSIC_VOLUME = 0.85;

export const SoundTrack: React.FC<{ starts: SceneStarts; transitions: number[] }> = ({ starts, transitions }) => {
  const cues: Cue[] = [
    ...([
      [starts.smash, SMASH],
      [starts.form, FORM_CUES],
      [starts.web, WEB_CUES],
      [starts.receipts, RECEIPT_CUES],
      [starts.connect, CONNECT_CUES],
      [starts.pay, PAY],
      [starts.end, END_CUES],
    ] as const).flatMap(([at, list]) => list.map(([f, s, v]): Cue => [at + f, s, v])),
    // Whoosh peaks mid-crossfade.
    ...transitions.map((f): Cue => [f - 3, "whoosh", 0.4]),
  ];
  return (
    <>
      <Audio src={staticFile("audio/music.wav")} volume={MUSIC_VOLUME} />
      {cues.map(([f, s, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} layout="none">
          <Audio src={staticFile(`audio/${s}.wav`)} volume={v} />
        </Sequence>
      ))}
    </>
  );
};
