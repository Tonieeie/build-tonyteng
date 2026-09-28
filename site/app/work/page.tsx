import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Footer, Label, Nav, wrap } from "@/components/sections";
import { Reveal } from "@/components/Reveal";
import { ProjectVideo } from "@/components/ProjectVideo";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Past projects — ${site.name}`,
  description: "Recent websites and a comparison platform, with desktop previews and animations.",
  alternates: { canonical: "/work" },
  // Client work: reachable from the site, but kept out of search results.
  robots: { index: false, follow: true },
};

export default function WorkPage() {
  return (
    <>
      <Nav home={false} />
      <main className={`${wrap} pt-16 pb-28 md:pt-24 md:pb-40`}>
        <Reveal>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-text">
            <ArrowLeft size={14} /> Back
          </Link>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <Label>Past projects</Label>
            <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-balance md:text-6xl">Things I&rsquo;ve built.</h1>
          </Reveal>
          <Reveal index={1} className="md:col-span-5 md:self-end">
            <p className="max-w-[48ch] leading-relaxed text-muted">
              A few recent projects, from hotel and product websites to an insurance comparison platform.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-28">
          {projects.map((p, i) => (
            <article key={p.id} className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
              <Reveal className={`md:col-span-8 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="overflow-hidden rounded-2xl border border-line bg-panel">
                  {"video" in p ? (
                    <ProjectVideo src={p.video} poster={p.image} label={p.alt} />
                  ) : (
                    <Image src={p.image} alt={p.alt} width={1600} height={1000} sizes="(min-width: 768px) 66vw, 100vw" className="h-auto w-full" />
                  )}
                </div>
              </Reveal>
              <Reveal index={1} className={`md:col-span-4 ${i % 2 ? "md:order-1" : ""}`}>
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{p.type}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance md:text-3xl">{p.title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{p.summary}</p>
                <ul className="mt-5 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15px] text-sub">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal className="mt-24 flex flex-col items-start gap-5 border-t border-line pt-12 md:mt-32 md:flex-row md:items-center md:justify-between">
          <p className="text-2xl font-semibold tracking-tight md:text-3xl">Got something in mind?</p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-ink transition hover:brightness-105 active:scale-[0.98]"
          >
            Get a free demo <ArrowRight size={16} weight="bold" />
          </Link>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
