"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { businessTypes, taskOptions } from "@/lib/site";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputCls =
  "w-full rounded-xl border bg-field px-4 py-3 text-[15px] text-text placeholder:text-faint outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const tasks = fd.getAll("tasks").map(String);

    const next: Errors = {};
    if (!data.name?.trim()) next.name = "Tell me what to call you.";
    if (!EMAIL_RE.test(data.email?.trim() ?? "")) next.email = "I need a valid email to reply to.";
    if (!tasks.length && (data.message?.trim().length ?? 0) < 10) next.message = "Tick at least one box above, or add a sentence or two.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tasks }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      form.reset();
      setStatus({ kind: "sent", name: data.name.trim().split(" ")[0] });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-2xl border border-line bg-panel p-8 md:p-10" role="status">
        <CheckCircle size={40} weight="duotone" className="text-accent" />
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">Thanks, {status.name}. Got it.</h3>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-muted">
          I&apos;ll read it properly and reply by email with questions or a plan for your demo.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-8 font-mono text-sm text-sub underline decoration-line-hi underline-offset-4 hover:text-text"
        >
          Send another request
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-2xl border border-line bg-panel p-6 md:p-8">
      <fieldset>
        <legend className="text-sm text-sub">What eats most of your week?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {taskOptions.map((t) => (
            <label key={t} className="group cursor-pointer">
              <input type="checkbox" name="tasks" value={t} className="peer sr-only" />
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-field px-4 py-2 text-sm text-sub transition group-hover:border-line-hi peer-checked:border-accent peer-checked:bg-accent-dim peer-checked:text-text peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25">
                <Check size={13} weight="bold" className="hidden text-accent group-has-[:checked]:inline" />
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" maxLength={100} className={`${inputCls} ${errors.name ? "border-warn" : "border-line"}`} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={200}
            className={`${inputCls} ${errors.email ? "border-warn" : "border-line"}`}
          />
        </Field>
        <Field id="industry" label="Type of business" hint="Optional">
          <select id="industry" name="industry" defaultValue="" className={`${inputCls} border-line appearance-none`}>
            <option value="">Choose one</option>
            {businessTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field id="company" label="Business name" hint="Optional">
          <input id="company" name="company" autoComplete="organization" maxLength={120} className={`${inputCls} border-line`} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="message" label="Tell me a bit more" error={errors.message} hint="Optional if you ticked a box">
            <textarea
              id="message"
              name="message"
              rows={5}
              maxLength={5000}
              placeholder="e.g. Every Friday I spend 3 hours typing receipts into Xero, and people who message at night wait until morning for a reply."
              className={`${inputCls} resize-y ${errors.message ? "border-warn" : "border-line"}`}
            />
          </Field>
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" ? (
        <p role="alert" className="mt-5 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          {status.message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-faint">No payment until you&apos;ve seen the demo.</p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-ink transition hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
        >
          {sending ? <CircleNotch size={16} weight="bold" className="animate-spin" /> : null}
          {sending ? "Sending…" : "Send my request"}
          {!sending ? <ArrowRight size={16} weight="bold" /> : null}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm text-sub">
        {label}
        {hint && !error ? <span className="font-mono text-[11px] text-faint">{hint}</span> : null}
      </label>
      {children}
      {error ? <p className="text-sm text-warn">{error}</p> : null}
    </div>
  );
}
