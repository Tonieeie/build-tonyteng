"use client";

import { useState, type KeyboardEvent } from "react";
import { Buildings, Calculator, Check, FirstAid, Storefront, Wrench } from "@phosphor-icons/react";
import { industries } from "@/lib/site";

const icons = {
  trades: Wrench,
  clinics: FirstAid,
  property: Buildings,
  shops: Storefront,
  accounting: Calculator,
} as const;

export function IndustryTabs() {
  const [active, setActive] = useState(0);
  const current = industries[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const next = (active + dir + industries.length) % industries.length;
    setActive(next);
    document.getElementById(`tab-${industries[next].id}`)?.focus();
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
      <div role="tablist" aria-label="Industries" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-1 md:col-span-4 md:flex-col md:overflow-visible md:pb-0">
        {industries.map((ind, i) => {
          const Icon = icons[ind.id];
          const on = i === active;
          return (
            <button
              key={ind.id}
              id={`tab-${ind.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`panel-${ind.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
              className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition md:w-full ${
                on ? "border-accent/50 bg-accent-dim text-text" : "border-line bg-panel/60 text-sub hover:border-line-hi hover:text-text"
              }`}
            >
              <Icon size={20} weight="duotone" className={on ? "text-accent" : "text-muted"} />
              <span className="whitespace-nowrap font-medium">{ind.name}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="rounded-2xl border border-line bg-panel p-6 md:col-span-8 md:p-10"
      >
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{current.blurb}</p>
        <ul key={current.id} className="mt-6 space-y-5">
          {current.examples.map((ex, i) => (
            <li
              key={ex}
              className="flex gap-4 text-lg leading-relaxed text-text"
              style={{ animation: `tab-in 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both` }}
            >
              <span className="mt-1.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                <Check size={14} weight="bold" />
              </span>
              {ex}
            </li>
          ))}
        </ul>
        <a href="#contact" className="mt-8 inline-flex text-[15px] font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
          Not your industry? Tell me what you do.
        </a>
      </div>
    </div>
  );
}
