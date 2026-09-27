"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";

export function PromoVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) userPaused.current = true;

    const onTime = () => {
      if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    // Only play while on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);

    return () => {
      io.disconnect();
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  // Browsers only autoplay muted video. Turning sound on restarts the tour so it is heard from the top.
  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      v.currentTime = 0;
      userPaused.current = false;
      v.play().catch(() => {});
      setMuted(false);
    } else {
      v.muted = true;
      setMuted(true);
    }
  };

  const pill =
    "absolute bottom-3 inline-flex items-center gap-2 rounded-full border border-line-hi bg-bg/70 px-3.5 py-2 font-mono text-xs text-text backdrop-blur-md transition hover:bg-bg/90 active:scale-[0.97] md:bottom-5";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] md:rounded-[1.75rem]">
      <video
        ref={video}
        className="block aspect-video w-full cursor-pointer"
        poster="/media/poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggle}
        aria-label="30-second tour: smashing repetitive work with custom AI agents, and how the demo-first process works"
      >
        {/* MP4 (H.264/AAC) first: every browser, including Safari and iOS, plays it. */}
        <source src="/media/promo-v5.mp4" type={'video/mp4; codecs="avc1.640028, mp4a.40.2"'} />
        <source src="/media/promo-v5.webm" type={'video/webm; codecs="vp9, opus"'} />
      </video>
      <button
        type="button"
        onClick={toggle}
        className={`${pill} left-3 md:left-5`}
      >
        {playing ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
        {playing ? "Pause" : "Play the 30s tour"}
      </button>
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        className={`${pill} right-3 md:right-5 ${muted ? "border-accent/60 text-accent" : ""}`}
      >
        {muted ? <SpeakerSlash size={14} weight="fill" /> : <SpeakerHigh size={14} weight="fill" />}
        {muted ? "Sound on" : "Mute"}
      </button>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/5">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
