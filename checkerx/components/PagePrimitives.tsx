"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "./LanguageProvider";

export function PageHeader({ kicker, title, body, copyId }: { kicker?: string; title?: string; body?: string; copyId?: string }) {
  const { t } = useI18n();
  const finalKicker = copyId ? t(`${copyId}.kicker`) : kicker;
  const finalTitle = copyId ? t(`${copyId}.title`) : title;
  const finalBody = copyId ? t(`${copyId}.body`) : body;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-10 md:px-8 md:pt-14">
      <p className="section-label">{finalKicker}</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">{finalTitle}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 md:text-lg">{finalBody}</p>
    </section>
  );
}

export function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`surface rounded-xl p-5 ${className}`}>{children}</div>;
}

export function FeatureTile({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <Surface>
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--cyan-soft)] text-[var(--cyan)]">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="mt-5 text-xl font-black text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-300">{body}</p>
    </Surface>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-5 text-sm font-black text-[#211f1b] shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition hover:brightness-110">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/7 px-5 text-sm font-bold text-white transition hover:bg-white/12">
      {children}
    </Link>
  );
}
