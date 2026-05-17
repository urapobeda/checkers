import { Check, Crown, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, PrimaryLink, Surface } from "@/components/PagePrimitives";
import { proBenefits } from "@/lib/content";

export default function ProPage() {
  return (
    <AppShell>
      <PageHeader
        kicker="Founder Pro"
        title="A monetization path without real payments yet."
        body="CheckerX Pro will unlock deeper reviews, custom skins, mistake drills, and visible Founder status."
      />
      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-28 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:pb-16">
        <Surface>
          <p className="flex items-center gap-2 text-xl font-black text-white">
            <Crown className="h-5 w-5 text-[var(--amber)]" />
            Pro Demo
          </p>
          <p className="mt-4 text-5xl font-black text-white">$9<span className="text-base font-bold text-slate-400">/mo demo</span></p>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            No card collection for the prototype. This button will save local Founder status first, then Supabase subscription state later.
          </p>
          <div className="mt-6">
            <PrimaryLink href="/coach">
              <Sparkles className="h-4 w-4" />
              Activate demo
            </PrimaryLink>
          </div>
        </Surface>
        <section className="grid gap-4 md:grid-cols-2">
          {proBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Surface key={benefit.title}>
                <Icon className="h-5 w-5 text-[var(--cyan)]" />
                <h2 className="mt-4 text-xl font-black text-white">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{benefit.body}</p>
              </Surface>
            );
          })}
        </section>
        <Surface className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-4">
            {["No real payment", "Founder badge", "Skin marketplace idea", "Deeper AI coach"].map((item) => (
              <span key={item} className="flex min-h-14 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-bold text-slate-200">
                <Check className="h-4 w-4 text-[var(--cyan)]" />
                {item}
              </span>
            ))}
          </div>
        </Surface>
      </main>
    </AppShell>
  );
}
