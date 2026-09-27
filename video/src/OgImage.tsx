import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, BrandMark } from "./Chrome";
import { copy } from "./copy/en";
import { C, FONT } from "./theme";

/** 1200×630 social preview card. */
export const OgImage: React.FC = () => {
  const { url } = copy.brand;
  const dot = url.indexOf(".");
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <Backdrop />
      <BrandMark scale={1.1} suffix style={{ position: "absolute", left: 72, top: 64 }} />
      <div style={{ position: "absolute", left: 72, top: 170, width: 1000, fontSize: 72, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
        <span style={{ color: C.accent }}>Smash</span> your repetitive work with custom AI.
      </div>
      <div style={{ position: "absolute", left: 72, bottom: 72, display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em" }}>
          <span style={{ color: C.accent }}>{url.slice(0, dot)}</span>
          {url.slice(dot)}
        </span>
        <span style={{ fontSize: 22, color: C.muted }}>See a working demo before you pay.</span>
      </div>
    </AbsoluteFill>
  );
};
