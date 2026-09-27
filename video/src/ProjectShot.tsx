import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop } from "./Chrome";
import { C } from "./theme";

// 1600×1000 mockup of a past project: desktop screenshot in a browser, mobile screenshot on a phone.
// No URL is shown — client projects stay anonymous.
export type ProjectShotProps = { desktop: string; mobile: string };

export const ProjectShot: React.FC<ProjectShotProps> = ({ desktop, mobile }) => (
  <AbsoluteFill>
    <Backdrop />
    <AbsoluteFill
      style={{ background: "radial-gradient(ellipse 60% 55% at 45% 45%, rgba(195,236,110,0.07), transparent 70%)" }}
    />

    {/* browser */}
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 96,
        width: 1200,
        borderRadius: 18,
        overflow: "hidden",
        background: C.panel,
        border: `1px solid ${C.lineHi}`,
        boxShadow: "0 50px 120px -40px rgba(0,0,0,0.95)",
      }}
    >
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 16, padding: "0 18px", background: C.panelHi, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: "rgba(255,255,255,0.14)" }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 24, borderRadius: 7, background: C.field, border: `1px solid ${C.line}`, maxWidth: 520 }} />
      </div>
      <Img src={staticFile(desktop)} style={{ display: "block", width: 1200, height: 750, objectFit: "cover", objectPosition: "top" }} />
    </div>

    {/* phone */}
    <div
      style={{
        position: "absolute",
        left: 1180,
        top: 250,
        width: 350,
        height: 740,
        borderRadius: 52,
        background: "#07080A",
        border: "10px solid #1E2127",
        overflow: "hidden",
        boxShadow: "0 50px 110px -30px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      <Img src={staticFile(mobile)} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      <div style={{ position: "absolute", top: 10, left: "50%", marginLeft: -48, width: 96, height: 26, borderRadius: 13, background: "#000" }} />
    </div>
  </AbsoluteFill>
);
