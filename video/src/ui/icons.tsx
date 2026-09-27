import React from "react";

type P = { size?: number; color?: string; stroke?: number };

export const Check: React.FC<P> = ({ size = 16, color = "currentColor", stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3.2 3L13 4.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Clip: React.FC<P> = ({ size = 16, color = "currentColor", stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M10.5 4.5L5.4 9.6a1.6 1.6 0 002.3 2.3l5.4-5.4a3 3 0 00-4.3-4.3L3.4 7.6a4.4 4.4 0 006.2 6.2l4.1-4.1"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </svg>
);

export const Warn: React.FC<P> = ({ size = 16, color = "currentColor", stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 2.2l6.3 11H1.7L8 2.2z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    <path d="M8 6.5v3.2M8 11.6v.1" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Arrow: React.FC<P> = ({ size = 16, color = "currentColor", stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Lock: React.FC<P> = ({ size = 14, color = "currentColor", stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke={color} strokeWidth={stroke} />
    <path d="M5.5 7V5.2a2.5 2.5 0 015 0V7" stroke={color} strokeWidth={stroke} />
  </svg>
);

export const Hash: React.FC<P> = ({ size = 14, color = "currentColor", stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M6 2.5L4.8 13.5M11.2 2.5L10 13.5M2.8 6h11M2.2 10h11" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Doc: React.FC<P> = ({ size = 16, color = "currentColor", stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 1.8h5.2L12.5 5v9.2H4z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    <path d="M9 1.8V5.3h3.5M6 8.5h4.5M6 11h4.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Person: React.FC<P> = ({ size = 16, color = "currentColor", stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.8" stroke={color} strokeWidth={stroke} />
    <path d="M2.8 14c.6-2.8 2.7-4.3 5.2-4.3s4.6 1.5 5.2 4.3" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Chevron: React.FC<P> = ({ size = 14, color = "currentColor", stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Rotating arc used as a "working" indicator. `turn` is 0..1. */
export const Spinner: React.FC<P & { turn: number }> = ({ size = 16, color = "currentColor", stroke = 1.8, turn }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ transform: `rotate(${turn * 360}deg)` }}>
    <circle cx="8" cy="8" r="6" stroke={color} strokeOpacity={0.2} strokeWidth={stroke} />
    <path d="M8 2a6 6 0 016 6" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

/** Agent glyph: a small node graph. */
export const AgentGlyph: React.FC<P> = ({ size = 18, color = "currentColor", stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="2.6" stroke={color} strokeWidth={stroke} />
    <circle cx="3.2" cy="3.6" r="1.4" fill={color} />
    <circle cx="14.8" cy="3.6" r="1.4" fill={color} />
    <circle cx="9" cy="15.6" r="1.4" fill={color} />
    <path d="M4.3 4.6l2.8 2.6M13.7 4.6l-2.8 2.6M9 11.6v2.6" stroke={color} strokeWidth={stroke} />
  </svg>
);
