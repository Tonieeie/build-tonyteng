import React from "react";
import { startOf, Timeline, totalFrames, type Scene } from "./Chrome";
import { Connect } from "./short/Connect";
import { EndSlogan } from "./short/EndSlogan";
import { FormCase } from "./short/FormCase";
import { Pay } from "./short/Pay";
import { ReceiptCase } from "./short/ReceiptCase";
import { Smash } from "./short/Smash";
import { SoundTrack, type SceneStarts } from "./short/Sound";
import { WebCase } from "./short/WebCase";

// 30-second cut — the main promo.
const T = 10;

// Sequence lengths include the 10-frame overlap with the next scene.
// Sum (960) - 6 transitions (60) = 900 frames = 30s.
// Visible starts: smash 0, form 120, web 290, receipts 490, connect 660, pay 710, end 780.
// The music (scripts/audio.mjs) drops at 1.5s, lifts at 21.5s and hits at 26.0s (end card).
export const SHORT_SCENES: Scene[] = [
  { id: "smash", len: 130, el: <Smash /> },
  { id: "form", len: 180, el: <FormCase /> },
  { id: "web", len: 210, el: <WebCase /> },
  { id: "receipts", len: 180, el: <ReceiptCase /> },
  { id: "connect", len: 60, el: <Connect /> },
  { id: "pay", len: 80, el: <Pay /> },
  { id: "end", len: 120, el: <EndSlogan /> },
];

export const PROMO_FRAMES = totalFrames(SHORT_SCENES, T);

const STARTS = Object.fromEntries(SHORT_SCENES.map((s) => [s.id, startOf(SHORT_SCENES, T, s.id)])) as SceneStarts;
const TRANSITIONS = SHORT_SCENES.slice(1).map((s) => startOf(SHORT_SCENES, T, s.id));

export const Promo: React.FC = () => (
  <Timeline scenes={SHORT_SCENES} t={T}>
    <SoundTrack starts={STARTS} transitions={TRANSITIONS} />
  </Timeline>
);
