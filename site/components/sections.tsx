import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Browser,
  Check,
  FlowArrow,
  Lifebuoy,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { cases, faqs, nav, pains, pricing, proof, services, site, steps } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { IndustryTabs } from "./IndustryTabs";
import { PromoVideo } from "./PromoVideo";
import { Reveal } from "./Reveal";

export const wrap = "mx-auto w-full max-w-[1240px] px-4 md:px-8";

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{children}</p>;
}

function Mark() {
  return (
    <span className="flex items-baseline gap-2.5 whitespace-nowrap">
      <span className="size-2.5 translate-y-[-1px] self-center rounded-[2px] bg-accent" />
      <span className="text-[15px] font-semibold tracking-tight text-text">{site.name}</span>
    </span>
  );
}

const primaryBtn =
  "inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-ink transition hover:brightness-105 active:scale-[0.98]";
const ghostBtn =
  "inline-flex items-center gap-2 rounded-full border border-line-hi px-6 py-3 text-[15px] text-sub transition hover:border-text/40 hover:text-text active:scale-[0.98]";

/* ---------------- Nav ---------------- */

export function Nav({ home = true }: { home?: boolean }) {
  const href = (h: string) => (!home && h.startsWith("#") ? `/${h}` : h);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className={`${wrap} flex h-16 items-center justify-between`}>
        <Link href={home ? "#top" : "/"} aria-label={`${site.name}, home`}>
          <Mark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={href(n.href)} className="transition hover:text-text">
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href={href("#contact")}
          className="shrink-0 whitespace-nowrap rounded-full bg-text px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white active:scale-[0.97] sm:px-4"
        >
          <span className="sm:hidden">Free demo</span>
          <span className="hidden sm:inline">Get a free demo</span>
        </a>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */

export function Hero() {
  return (
    <section id="top" className={`${wrap} pt-16 md:pt-24`}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-8">
          <Reveal>
            <Label>For small businesses · No tech skills needed</Label>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl lg:text-[4.4rem]">
              Less admin. Better tools.
              <span className="mt-2 block text-accent">No IT team needed.</span>
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
              I help small businesses automate everyday tasks and build the websites and tools they need. I handle the setup,
              show you how to use it, and offer ongoing care after launch.
            </p>
          </Reveal>
          <Reveal index={3} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#contact" className={primaryBtn}>
              Tell me what you need <ArrowRight size={16} weight="bold" />
            </a>
            <a href="#work" className={ghostBtn}>
              See examples
            </a>
          </Reveal>
          <Reveal index={4}>
            <p className="mt-4 text-sm text-muted">Free working demo. Fixed quote before any paid work starts.</p>
          </Reveal>
        </div>
        <div className="self-end md:col-span-4">
          <ul className="divide-y divide-line border-y border-line">
            {proof.map((p, i) => (
              <Reveal as="li" key={p.t} index={i + 3} className="py-4">
                <p className="text-[15px] font-semibold">{p.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.d}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal index={6}>
            <Link href="/work" className="mt-4 inline-flex items-center gap-1.5 text-sm text-sub transition hover:text-text">
              See things I&rsquo;ve built <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Sound familiar? ---------------- */

export function SoundFamiliar() {
  return (
    <section id="familiar" className={`${wrap} pt-28 md:pt-40`}>
      <Reveal>
        <Label>Sound familiar?</Label>
        <h2 className="mt-4 max-w-[20ch] text-4xl font-semibold tracking-tighter text-balance md:text-6xl">
          The jobs that eat your evenings.
        </h2>
      </Reveal>
      <ul className="mt-12 divide-y divide-line border-y border-line md:mt-16">
        {pains.map((p, i) => (
          <Reveal as="li" key={p.said} index={i % 3} className="grid grid-cols-1 gap-3 py-7 md:grid-cols-12 md:items-center md:gap-8 md:py-8">
            <p className="text-xl leading-snug font-medium tracking-tight text-text md:col-span-6 md:text-2xl">&ldquo;{p.said}&rdquo;</p>
            <div className="flex items-start gap-3 md:col-span-6">
              <ArrowRight size={20} weight="bold" className="mt-1 shrink-0 text-accent" />
              <p className="text-lg leading-relaxed text-muted">{p.fix}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Examples ---------------- */

export function Work() {
  return (
    <section id="work" className={`${wrap} pt-28 md:pt-40`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <Label>Examples</Label>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-balance md:text-6xl">
            <span className="smash-word inline-block text-accent">Smash</span> your repetitive work.
          </h2>
        </Reveal>
        <Reveal index={1} className="md:col-span-5 md:self-end">
          <p className="max-w-[48ch] leading-relaxed text-muted">
            From repeated form-filling to a website or a receipt app. Each is built around the way your business already runs.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-12 md:mt-16">
        <PromoVideo />
      </Reveal>

      <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-32">
        {cases.map((c, i) => {
          const flip = i % 2 === 1;
          return (
            <article key={c.n} className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
              <Reveal className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
                <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
                  <Image src={c.image} alt={c.alt} width={3840} height={1580} sizes="(min-width: 768px) 60vw, 100vw" className="h-auto w-full" />
                </div>
              </Reveal>
              <Reveal index={1} className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                  <span className="text-accent">{c.n}</span> · {c.label}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-balance md:text-3xl">{c.title}</h3>
                <dl className="mt-6 space-y-5">
                  <div>
                    <dt className="text-sm font-semibold text-sub">Before</dt>
                    <dd className="mt-1.5 leading-relaxed text-muted">{c.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-sub">After</dt>
                    <dd className="mt-1.5 leading-relaxed text-muted">{c.how}</dd>
                  </div>
                </dl>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {c.goodFor.map((g) => (
                    <li key={g} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-sub">
                      {g}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Industries ---------------- */

export function Industries() {
  return (
    <section id="industries" className={`${wrap} pt-28 md:pt-40`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <Label>Who it&rsquo;s for</Label>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-balance md:text-6xl">What it looks like in your business.</h2>
        </Reveal>
        <Reveal index={1} className="md:col-span-5 md:self-end">
          <p className="max-w-[48ch] leading-relaxed text-muted">
            A few examples from the kinds of businesses that lose the most hours to admin. Pick yours.
          </p>
        </Reveal>
      </div>
      <Reveal index={1} className="mt-12">
        <IndustryTabs />
      </Reveal>
    </section>
  );
}

/* ---------------- Process ---------------- */

export function Process() {
  return (
    <section id="process" className={`${wrap} pt-28 md:pt-40`}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Reveal>
              <Label>How it works</Label>
              <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-balance md:text-5xl">See it work before you pay.</h2>
              <p className="mt-5 max-w-[42ch] leading-relaxed text-muted">
                No deposit, no jargon. You pay once you&rsquo;ve seen a working demo and decided you want it.
              </p>
            </Reveal>
          </div>
        </div>
        <ol className="md:col-span-7">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} index={i} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-line py-8 md:grid-cols-[6rem_1fr] md:py-10">
              <span className="font-mono text-3xl text-accent md:text-4xl">{s.n}</span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{s.title}</h3>
                <p className="mt-2 max-w-[52ch] leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" className="flex items-center gap-4 border-t border-line pt-8">
            <span className="h-px w-10 bg-accent" />
            <p className="text-lg text-sub">
              Demo not right for you? <span className="font-semibold text-text">You owe nothing.</span>
            </p>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

export function Pricing() {
  return (
    <section id="pricing" className={`${wrap} pt-28 md:pt-40`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <Label>Pricing</Label>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-balance md:text-6xl">Honest prices, agreed up front.</h2>
        </Reveal>
        <Reveal index={1} className="md:col-span-5 md:self-end">
          <p className="max-w-[48ch] leading-relaxed text-muted">
            You get a fixed quote after the free demo, before any paid work starts. Prices in Australian dollars.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 divide-y divide-line border-y border-line">
        {pricing.tiers.map((t, i) => (
          <Reveal key={t.name} index={i} className="grid grid-cols-1 gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-8">
            <p className="text-lg font-semibold tracking-tight md:col-span-3">{t.name}</p>
            <p className="md:col-span-4">
              <span className={`text-3xl font-semibold tracking-tight md:text-4xl ${i === 0 ? "text-accent" : "text-text"}`}>{t.price}</span>
              {t.unit ? <span className="ml-2 font-mono text-xs text-muted">{t.unit}</span> : null}
            </p>
            <p className="leading-relaxed text-muted md:col-span-5">{t.body}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6">
        <p className="max-w-[80ch] text-sm leading-relaxed text-faint">
          Running costs for the AI and hosting are usually {pricing.running} a month, paid straight to those providers at cost. No
          lock-in: what I build runs in your own accounts.
        </p>
      </Reveal>
    </section>
  );
}

/* ---------------- Services & support ---------------- */

const serviceIcons = { flow: FlowArrow, browser: Browser, care: Lifebuoy } as const;

export function Services() {
  return (
    <section id="services" className={`${wrap} pt-16 md:pt-24`}>
      <Reveal>
        <Label>Services & support</Label>
        <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-balance md:text-4xl">Build it. Use it. Keep it running.</h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = serviceIcons[service.icon];
          const care = service.icon === "care";
          return (
            <Reveal key={service.title} index={i} className={`flex flex-col rounded-2xl border p-6 md:p-8 ${care ? "border-accent/40 bg-accent-dim" : "border-line bg-panel"}`}>
              <div className="flex items-center gap-3 text-accent">
                <Icon size={24} weight="duotone" aria-hidden />
                <p className="font-mono text-xs uppercase tracking-[0.08em]">{service.label}</p>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-sub">{service.body}</p>
              <ul className="mt-6 space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-sub">
                    <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                {care ? (
                  <p className="mb-4 text-sm text-sub">From <span className="text-2xl font-semibold text-text">{pricing.care}</span> / month · Optional</p>
                ) : null}
                <Link href={service.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 transition hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  {service.link} <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal className="mt-6">
        <p className="text-sm leading-relaxed text-muted">Start with one problem. I help you work out what to build and what support you need.</p>
      </Reveal>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function Faq() {
  return (
    <section id="faq" className={`${wrap} pt-28 md:pt-40`}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-4">
          <Label>FAQ</Label>
          <h2 className="mt-4 text-3xl font-semibold tracking-tighter md:text-5xl">Questions</h2>
        </Reveal>
        <div className="divide-y divide-line border-y border-line md:col-span-8">
          {faqs.map((f, i) => (
            <Reveal key={f.q} index={i % 4}>
              <details className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-medium tracking-tight">
                  {f.q}
                  <Plus size={18} className="faq-plus shrink-0 text-muted transition-transform duration-300" />
                </summary>
                <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

const next = ["I reply with questions or a plan.", "You get a free working demo.", "You decide whether to go ahead."];

export function Contact() {
  return (
    <section id="contact" className={`${wrap} pt-28 pb-28 md:pt-40 md:pb-40`}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-5">
          <Label>Start here</Label>
          <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-balance md:text-5xl">Tell me what&rsquo;s eating your week.</h2>
          <p className="mt-5 max-w-[42ch] leading-relaxed text-muted">
            Tick what applies, add a line or two if you like. I read every request myself and reply by email.
          </p>
          <ol className="mt-10 space-y-4">
            {next.map((n, i) => (
              <li key={n} className="flex items-center gap-4 text-sub">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line-hi font-mono text-xs text-muted">
                  {i + 1}
                </span>
                {n}
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal index={1} className="md:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className={`${wrap} flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between`}>
        <Mark />
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/work" className="text-sub transition hover:text-text">
            Past projects
          </Link>
          <span>
            © {new Date().getFullYear()} {site.owner} ·{" "}
            <a href={site.ownerUrl} className="inline-flex items-center gap-1 text-sub transition hover:text-text">
              tonyteng.dev <ArrowUpRight size={13} />
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
