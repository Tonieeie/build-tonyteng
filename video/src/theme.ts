import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

const geist = loadGeist("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const geistMono = loadGeistMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const FONT = geist.fontFamily;
export const MONO = geistMono.fontFamily;

// One accent (signal lime). Warn is used only for status.
export const C = {
  bg: "#0B0C0E",
  panel: "#14161A",
  panelHi: "#1A1D22",
  field: "#0F1114",
  line: "rgba(255,255,255,0.08)",
  lineHi: "rgba(255,255,255,0.16)",
  text: "#F2F2EE",
  sub: "#C4C7CC",
  muted: "#8B919B",
  faint: "#5A606A",
  accent: "#C3EC6E",
  accentDim: "rgba(195,236,110,0.14)",
  accentLine: "rgba(195,236,110,0.45)",
  ink: "#0B0C0E",
  warn: "#F0B45C",
  warnDim: "rgba(240,180,92,0.14)",
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const PAD = 96;
