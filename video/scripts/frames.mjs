// Render specific frames of a composition to out/frames/ for quick visual checks.
// Usage: node scripts/frames.mjs [CompositionId=Promo] 60 330 720 ...
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const id = isNaN(Number(args[0])) ? args.shift() : "Promo";
const frames = args.map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const frame of frames) {
  const output = path.resolve(`out/frames/${id}-${String(frame).padStart(4, "0")}.jpg`);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 85 });
  console.log(output);
}
