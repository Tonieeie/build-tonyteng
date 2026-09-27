import React from "react";
import { Timeline, totalFrames, type Scene } from "./Chrome";
import { EndCard } from "./scenes/EndCard";
import { FormBot } from "./scenes/FormBot";
import { Hook } from "./scenes/Hook";
import { HowItWorks } from "./scenes/HowItWorks";
import { InvoiceBot } from "./scenes/InvoiceBot";
import { SupportAgent } from "./scenes/SupportAgent";

// 60-second cut. Kept for the website's case-study stills (see package.json "stills").
const T = 15;

// Sequence lengths include the 15-frame overlap with the next scene.
// Sum (1875) - 5 transitions (75) = 1800 frames = 60s.
const SCENES: Scene[] = [
  { id: "hook", len: 130, el: <Hook /> },
  { id: "form", len: 435, el: <FormBot /> },
  { id: "invoice", len: 405, el: <InvoiceBot /> },
  { id: "support", len: 495, el: <SupportAgent /> },
  { id: "how", len: 255, el: <HowItWorks /> },
  { id: "end", len: 155, el: <EndCard /> },
];

export const PROMO_FULL_FRAMES = totalFrames(SCENES, T);

export const PromoFull: React.FC = () => <Timeline scenes={SCENES} t={T} />;
