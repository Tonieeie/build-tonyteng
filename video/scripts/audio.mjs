// Procedurally synthesises the promo's music bed and sound effects into public/audio/.
// Everything is generated from code (no samples), so there is nothing to license.
// Usage: node scripts/audio.mjs
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const OUT = path.resolve("public/audio");
fs.mkdirSync(OUT, { recursive: true });

/* ---------------- helpers ---------------- */

// Deterministic RNG (mulberry32) so every run produces identical audio.
let seed = 1337;
const rnd = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const TAU = Math.PI * 2;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const coef = (fc) => 1 - Math.exp((-TAU * fc) / SR);
const mono = (sec) => new Float32Array(Math.ceil(sec * SR));
const stereo = (sec) => ({ L: mono(sec), R: mono(sec) });

/** Mix a mono clip into a stereo bus at time t0 (s), with gain and pan (-1..1). */
function place(bus, t0, clip, gain = 1, pan = 0) {
  const i0 = Math.round(t0 * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < clip.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= bus.L.length) continue;
    bus.L[j] += clip[i] * gl;
    bus.R[j] += clip[i] * gr;
  }
}

/** One-pole lowpass with a (possibly time-varying) cutoff function. */
function lowpass(x, fc) {
  const y = new Float32Array(x.length);
  let s = 0;
  for (let i = 0; i < x.length; i++) {
    const c = coef(typeof fc === "function" ? fc(i / SR) : fc);
    s += c * (x[i] - s);
    y[i] = s;
  }
  return y;
}
const highpass = (x, fc) => {
  const lp = lowpass(x, fc);
  return x.map((v, i) => v - lp[i]);
};

/** Stereo ping-pong delay, in place. */
function delay(bus, time, fb, mix) {
  const d = Math.round(time * SR);
  const L = bus.L.slice();
  const R = bus.R.slice();
  for (let i = d; i < L.length; i++) {
    L[i] += R[i - d] * fb;
    R[i] += L[i - d] * fb;
  }
  for (let i = 0; i < L.length; i++) {
    bus.L[i] = bus.L[i] * (1 - mix) + L[i] * mix;
    bus.R[i] = bus.R[i] * (1 - mix) + R[i] * mix;
  }
}

/** Small Schroeder reverb (4 combs + 2 allpasses per side), in place. */
function reverb(bus, size = 1, mix = 0.25) {
  const combs = [1116, 1188, 1277, 1356].map((n) => Math.round(n * size));
  const aps = [556, 441];
  const run = (x, spread) => {
    const out = new Float32Array(x.length);
    for (const n0 of combs) {
      const n = n0 + spread;
      const buf = new Float32Array(n);
      let idx = 0;
      let lp = 0;
      for (let i = 0; i < x.length; i++) {
        const o = buf[idx];
        lp = o * 0.7 + lp * 0.3;
        buf[idx] = x[i] + lp * 0.8;
        out[i] += o / combs.length;
        idx = (idx + 1) % n;
      }
    }
    for (const n0 of aps) {
      const n = n0 + spread;
      const buf = new Float32Array(n);
      let idx = 0;
      for (let i = 0; i < out.length; i++) {
        const b = buf[idx];
        const v = out[i];
        buf[idx] = v + b * 0.5;
        out[i] = b - v * 0.5;
        idx = (idx + 1) % n;
      }
    }
    return out;
  };
  const wl = run(bus.L, 0);
  const wr = run(bus.R, 23);
  for (let i = 0; i < bus.L.length; i++) {
    bus.L[i] = bus.L[i] * (1 - mix) + wl[i] * mix;
    bus.R[i] = bus.R[i] * (1 - mix) + wr[i] * mix;
  }
}

function normalize(bus, peakDb) {
  let peak = 0;
  for (let i = 0; i < bus.L.length; i++) peak = Math.max(peak, Math.abs(bus.L[i]), Math.abs(bus.R[i]));
  const g = peak ? 10 ** (peakDb / 20) / peak : 1;
  for (let i = 0; i < bus.L.length; i++) {
    bus.L[i] *= g;
    bus.R[i] *= g;
  }
}

function writeWav(name, bus) {
  const n = bus.L.length;
  const data = Buffer.alloc(44 + n * 4);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + n * 4, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 4, 28);
  data.writeUInt16LE(4, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, bus.L[i])) * 32767), 44 + i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, bus.R[i])) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(path.join(OUT, `${name}.wav`), data);
  console.log(`${name}.wav  ${(n / SR).toFixed(2)}s`);
}

/** Render a one-shot SFX: build a stereo bus, optional reverb, normalise, write. */
function sfx(name, sec, build, { verb = 0, peak = -1 } = {}) {
  const bus = stereo(sec);
  build(bus);
  if (verb) reverb(bus, 1, verb);
  normalize(bus, peak);
  // 5 ms fade-out so nothing clicks at the end.
  const f = Math.round(0.005 * SR);
  for (let i = 0; i < f; i++) {
    const g = i / f;
    bus.L[bus.L.length - 1 - i] *= g;
    bus.R[bus.R.length - 1 - i] *= g;
  }
  writeWav(name, bus);
}

/* ---------------- instruments ---------------- */

function kick(dur = 0.45, punch = 1) {
  const x = mono(dur);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 44 + 110 * Math.exp(-t * 32);
    ph += (TAU * f) / SR;
    x[i] = Math.tanh(Math.sin(ph) * Math.exp(-t * 7.5) * 1.6 * punch) + noise() * Math.exp(-t * 450) * 0.25;
  }
  return x;
}

function clap() {
  const x = mono(0.3);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let env = Math.exp(-t * 16) * 0.55;
    for (const o of [0, 0.011, 0.022]) if (t >= o) env += Math.exp(-(t - o) * 160) * 0.8;
    x[i] = noise() * env;
  }
  return lowpass(highpass(x, 900), 3200);
}

function hat(open = false) {
  const x = mono(open ? 0.3 : 0.07);
  for (let i = 0; i < x.length; i++) x[i] = noise() * Math.exp((-i / SR) * (open ? 11 : 70));
  return highpass(highpass(x, 6500), 6500);
}

function bass(m, dur) {
  const f = mtof(m);
  const x = mono(dur);
  let p1 = 0;
  let p2 = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    p1 = (p1 + f / SR) % 1;
    p2 = (p2 + (f * 1.004) / SR) % 1;
    const saw = (p1 * 2 - 1 + (p2 * 2 - 1)) * 0.5;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 4) * (t > dur - 0.02 ? (dur - t) / 0.02 : 1);
    x[i] = saw * env + Math.sin(TAU * f * t) * env * 0.8;
  }
  return lowpass(x, (t) => 180 + 1100 * Math.exp(-t * 14));
}

function pluck(m, dur = 0.3) {
  const f = mtof(m);
  const x = mono(dur);
  let p = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    p = (p + f / SR) % 1;
    const sq = p < 0.5 ? 1 : -1;
    const saw = p * 2 - 1;
    x[i] = (sq * 0.5 + saw * 0.5) * Math.min(1, t / 0.002) * Math.exp(-t * 11);
  }
  return lowpass(x, (t) => 400 + 4200 * Math.exp(-t * 16));
}

function pad(notes, dur, attack = 0.5) {
  const x = mono(dur);
  for (const m of notes) {
    for (const det of [-0.006, 0, 0.007]) {
      const f = mtof(m) * (1 + det);
      let p = rnd();
      for (let i = 0; i < x.length; i++) {
        p = (p + f / SR) % 1;
        const t = i / SR;
        const env = Math.min(1, t / attack) * Math.min(1, (dur - t) / 0.6);
        x[i] += (p * 2 - 1) * env * 0.12;
      }
    }
  }
  return lowpass(lowpass(x, 1400), 2200);
}

/* ---------------- music (30 s, 120 BPM, drop at 1.5 s) ---------------- */

function music() {
  const LEN = 30;
  const BEAT = 0.5;
  const DROP = 1.5; // = the SMASH impact (frame 45 @ 30fps)
  const END = 25.5; // groove stops; end card hit at 26.0
  const HIT = 26.0;
  const LIFT = 21.5; // around the "works with your apps" beat

  const drums = stereo(LEN);
  const bassBus = stereo(LEN);
  const arpBus = stereo(LEN);
  const padBus = stereo(LEN);

  // A minor: Am – F – C – G, one bar (2 s) each, starting on the drop.
  const CHORDS = [
    { bass: 45, arp: [69, 72, 76, 81], pad: [57, 60, 64] },
    { bass: 41, arp: [65, 69, 72, 77], pad: [53, 57, 60] },
    { bass: 48, arp: [67, 72, 76, 79], pad: [55, 60, 64] },
    { bass: 43, arp: [67, 71, 74, 79], pad: [55, 59, 62] },
  ];
  const chordAt = (t) => CHORDS[Math.floor((t - DROP) / (BEAT * 4)) % 4];

  // Intro: rising 16th hats before the drop.
  for (let t = 0; t < DROP; t += BEAT / 4) place(drums, t, hat(), 0.12 + 0.35 * (t / DROP), 0.3);

  const K = kick();
  const CL = clap();
  for (let b = 0; DROP + b * BEAT < END; b++) {
    const t = DROP + b * BEAT;
    place(drums, t, K, 0.7);
    if (b % 2 === 1) place(drums, t, CL, 0.55, -0.1);
    place(drums, t + BEAT / 2, hat(b % 8 === 7), 0.32, 0.25);
    place(drums, t + BEAT / 4, hat(), 0.12, -0.3);
    place(drums, t + (BEAT * 3) / 4, hat(), 0.14, -0.3);
    // bass: 8ths, octave bounce
    const ch = chordAt(t);
    place(bassBus, t, bass(ch.bass, BEAT / 2 - 0.01), 0.55);
    place(bassBus, t + BEAT / 2, bass(ch.bass + (b % 2 ? 12 : 0), BEAT / 2 - 0.01), 0.45);
  }

  // Arp: 16ths from the second bar after the drop; brighter from the "idea" scene (21.5 s).
  for (let t = DROP + BEAT * 4; t < END; t += BEAT / 4) {
    const ch = chordAt(t);
    const k = Math.round((t - DROP) / (BEAT / 4));
    const note = ch.arp[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]] + (t >= LIFT ? 12 : 0);
    place(arpBus, t, pluck(note), (k % 4 === 0 ? 0.3 : 0.2) * (t >= LIFT ? 1.1 : 1), ((k % 4) - 1.5) * 0.25);
  }
  delay(arpBus, BEAT * 0.75, 0.35, 0.35);

  // Pads: quiet under the intro, lift in the idea/pay scenes, final chord on the end card.
  place(padBus, 0, pad([57, 60, 64], DROP + 0.4, 1.2), 0.5);
  for (let t = LIFT; t < END; t += BEAT * 4) place(padBus, t, pad(chordAt(t).pad, BEAT * 4 + 0.3, 0.3), 0.6);
  place(padBus, HIT, pad([45, 57, 60, 64, 69], LEN - HIT, 0.05), 0.9);
  // End card hit + slow arp tail.
  place(drums, HIT, kick(0.9, 1.3), 0.75);
  place(drums, HIT, hat(true), 0.4);
  [69, 72, 76, 81, 76, 72].forEach((m, i) => place(arpBus, HIT + 0.25 + i * 0.25, pluck(m, 0.6), 0.18, i % 2 ? 0.4 : -0.4));
  reverb(padBus, 1.2, 0.35);

  const master = stereo(LEN);
  for (const [bus, g] of [
    [drums, 0.75],
    [bassBus, 0.9],
    [arpBus, 1.1],
    [padBus, 0.8],
  ]) {
    for (let i = 0; i < master.L.length; i++) {
      master.L[i] += bus.L[i] * g;
      master.R[i] += bus.R[i] * g;
    }
  }
  // Glue: soft clip, then fade the last 1.2 s.
  for (let i = 0; i < master.L.length; i++) {
    const t = i / SR;
    const fade = t > LEN - 1.2 ? Math.max(0, (LEN - t) / 1.2) : 1;
    master.L[i] = Math.tanh(master.L[i] * 0.9) * fade;
    master.R[i] = Math.tanh(master.R[i] * 0.9) * fade;
  }
  normalize(master, -2);
  writeWav("music", master);
}

/* ---------------- sound effects ---------------- */

function buildSfx() {
  // Riser into the SMASH: noise with opening filter + rising tone.
  sfx("riser", 1.45, (b) => {
    const n = mono(1.45);
    for (let i = 0; i < n.length; i++) n[i] = noise() * (i / n.length) ** 2;
    const swept = lowpass(n, (t) => 300 + 7000 * (t / 1.45) ** 2);
    const tone = mono(1.45);
    let ph = 0;
    for (let i = 0; i < tone.length; i++) {
      const t = i / SR;
      ph += (TAU * (180 + 900 * (t / 1.45) ** 2)) / SR;
      tone[i] = Math.sin(ph) * (t / 1.45) ** 3 * 0.35;
    }
    place(b, 0, swept, 0.8, -0.3);
    place(b, 0, swept, 0.8, 0.3);
    place(b, 0, tone, 1);
  });

  // The SMASH itself: sub boom + distorted crunch.
  sfx(
    "impact",
    2.2,
    (b) => {
      const boom = mono(2.2);
      let ph = 0;
      for (let i = 0; i < boom.length; i++) {
        const t = i / SR;
        ph += (TAU * (32 + 90 * Math.exp(-t * 9))) / SR;
        boom[i] = Math.tanh(Math.sin(ph) * Math.exp(-t * 2.2) * 2.2);
      }
      const crunch = mono(0.5);
      for (let i = 0; i < crunch.length; i++) crunch[i] = Math.tanh(noise() * 3) * Math.exp((-i / SR) * 12);
      place(b, 0, boom, 1);
      place(b, 0, lowpass(crunch, 2400), 0.7, -0.2);
      place(b, 0.004, lowpass(crunch, 2400), 0.7, 0.2);
    },
    { verb: 0.3 },
  );

  // Glass-ish shatter: bursts of bright grains + tiny pings, spread in stereo.
  sfx(
    "shatter",
    1.2,
    (b) => {
      for (let g = 0; g < 70; g++) {
        const t0 = 0.9 * rnd() ** 2.2;
        const len = 0.01 + rnd() * 0.05;
        const grain = mono(len);
        for (let i = 0; i < grain.length; i++) grain[i] = noise() * Math.exp((-i / SR) * (60 + rnd() * 60));
        place(b, t0, highpass(grain, 2500 + rnd() * 4000), (1 - t0) * (0.4 + rnd() * 0.6), rnd() * 2 - 1);
        if (rnd() < 0.35) {
          const f = 2500 + rnd() * 5000;
          const ping = mono(0.12);
          for (let i = 0; i < ping.length; i++) ping[i] = Math.sin((TAU * f * i) / SR) * Math.exp((-i / SR) * 40);
          place(b, t0, ping, 0.25 * (1 - t0), rnd() * 2 - 1);
        }
      }
    },
    { verb: 0.25 },
  );

  // Transition whoosh: filtered noise swell with a stereo sweep.
  sfx("whoosh", 0.55, (b) => {
    const n = mono(0.55);
    for (let i = 0; i < n.length; i++) {
      const t = i / SR / 0.55;
      n[i] = noise() * Math.sin(Math.PI * t) ** 2;
    }
    const f = lowpass(n, (t) => 400 + 5000 * Math.sin(Math.PI * (t / 0.55)));
    const half = Math.floor(f.length / 2);
    place(b, 0, f.subarray(0, half), 0.9, -0.6);
    place(b, half / SR, f.subarray(half), 0.9, 0.6);
  });

  // Card slap (the task cards landing).
  sfx("slap", 0.12, (b) => {
    const x = mono(0.12);
    let ph = 0;
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      ph += (TAU * (90 + 160 * Math.exp(-t * 60))) / SR;
      x[i] = Math.sin(ph) * Math.exp(-t * 40) + noise() * Math.exp(-t * 300) * 0.4;
    }
    place(b, 0, x, 1);
  });

  // Keyboard click.
  sfx("type", 0.03, (b) => {
    const x = mono(0.03);
    for (let i = 0; i < x.length; i++) x[i] = noise() * Math.exp((-i / SR) * 260);
    place(b, 0, lowpass(highpass(x, 1800), 7000), 1);
  });

  // Soft UI tick (field focus, highlight, list item).
  sfx("tick", 0.08, (b) => {
    const x = mono(0.08);
    for (let i = 0; i < x.length; i++) x[i] = Math.sin((TAU * 1900 * i) / SR) * Math.exp((-i / SR) * 70);
    place(b, 0, x, 1);
  });

  // Check / done: two rising blips.
  sfx("check", 0.25, (b) => {
    for (const [t0, f] of [
      [0, 1320],
      [0.07, 1980],
    ]) {
      const x = mono(0.16);
      for (let i = 0; i < x.length; i++) x[i] = Math.sin((TAU * f * i) / SR) * Math.exp((-i / SR) * 30);
      place(b, t0, x, 0.8);
    }
  });

  // Pop (chips, pills, bubbles, nodes).
  sfx("pop", 0.1, (b) => {
    const x = mono(0.1);
    let ph = 0;
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      ph += (TAU * (420 + 700 * Math.exp(-t * 55))) / SR;
      x[i] = Math.sin(ph) * Math.exp(-t * 38);
    }
    place(b, 0, x, 1);
  });

  // Success chime: bell partials of an A major-ish triad.
  sfx(
    "chime",
    1.4,
    (b) => {
      [
        [0, 880],
        [0.06, 1108.7],
        [0.12, 1318.5],
      ].forEach(([t0, f], k) => {
        const x = mono(1.2);
        for (let i = 0; i < x.length; i++) {
          const t = i / SR;
          x[i] = (Math.sin(TAU * f * t) + 0.4 * Math.sin(TAU * f * 2.01 * t) * Math.exp(-t * 6)) * Math.exp(-t * 3.2);
        }
        place(b, t0, x, 0.6, (k - 1) * 0.4);
      });
    },
    { verb: 0.35 },
  );

  // Warning: two descending tones.
  sfx(
    "warn",
    0.5,
    (b) => {
      [
        [0, 740],
        [0.13, 554],
      ].forEach(([t0, f]) => {
        const x = mono(0.3);
        for (let i = 0; i < x.length; i++) {
          const t = i / SR;
          const tri = (2 / Math.PI) * Math.asin(Math.sin(TAU * f * t));
          x[i] = tri * Math.min(1, t / 0.005) * Math.exp(-t * 9);
        }
        place(b, t0, x, 0.8);
      });
    },
    { verb: 0.2 },
  );

  // Data blip for the integration network.
  sfx("blip", 0.06, (b) => {
    const x = mono(0.06);
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      x[i] = Math.sin(TAU * (2600 + 1400 * t * 16) * t) * Math.exp(-t * 80);
    }
    place(b, 0, x, 1);
  });

  // Pouring hot chocolate: stream hiss + bubbles that rise in pitch as the cup fills.
  sfx(
    "pour",
    0.95,
    (b) => {
      const n = mono(0.95);
      for (let i = 0; i < n.length; i++) {
        const t = i / SR;
        const env = Math.min(1, t / 0.03) * (t > 0.68 ? Math.max(0, 1 - (t - 0.68) / 0.2) : 1);
        n[i] = noise() * env * (0.75 + 0.25 * Math.sin(t * 90 + Math.sin(t * 23) * 3));
      }
      place(b, 0, lowpass(highpass(n, 700), 3200), 0.55, -0.1);
      place(b, 0, lowpass(n, 380), 0.5, 0.1);
      for (let k = 0; k < 22; k++) {
        const t0 = 0.04 + rnd() * 0.66;
        const f0 = 320 + 700 * (t0 / 0.7) + rnd() * 120;
        const dur = 0.025 + rnd() * 0.035;
        const x = mono(dur);
        let ph = 0;
        for (let i = 0; i < x.length; i++) {
          const t = i / SR;
          ph += (TAU * f0 * (1 + t * 6)) / SR;
          x[i] = Math.sin(ph) * Math.exp(-t * 90);
        }
        place(b, t0, x, 0.35 + rnd() * 0.25, rnd() - 0.5);
      }
    },
    { verb: 0.15 },
  );

  // Scan sweep under the invoice read.
  sfx("scan", 1.0, (b) => {
    const n = mono(1.0);
    for (let i = 0; i < n.length; i++) {
      const t = i / SR;
      n[i] = noise() * Math.sin(Math.PI * t) * 0.6 + Math.sin(TAU * (500 + 900 * t) * t) * Math.sin(Math.PI * t) * 0.15;
    }
    place(b, 0, lowpass(highpass(n, 1500), 5000), 1);
  });
}

buildSfx();
music();
