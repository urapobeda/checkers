import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function PageHeader({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-10 md:px-8 md:pt-14">
      <p className="section-label">{kicker}</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{body}</p>
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
      <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
    </Surface>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--cyan)] px-5 text-sm font-black text-slate-950 transition hover:brightness-110">
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
