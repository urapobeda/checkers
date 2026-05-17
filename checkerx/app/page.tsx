import { ArrowRight, Brain, CheckCircle2, MoveDiagonal, Play, ShieldCheck, Sparkles, Trophy, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MiniCheckersBoard } from "@/components/MiniCheckersBoard";
import { FeatureTile, PrimaryLink, SecondaryLink, Surface } from "@/components/PagePrimitives";
import { productLoops, quickStats, roadmap } from "@/lib/content";

const loopSteps = [
  { title: "Learn", body: "Complete short tactical lessons and earn XP.", icon: MoveDiagonal },
  { title: "Play", body: "Challenge a bot, a friend room, or same-device rival.", icon: Sparkles },
  { title: "Review", body: "Turn every missed jump into a concrete training card.", icon: Brain },
  { title: "Climb", body: "Push your city rating after reviewed games.", icon: Trophy },
];

const proofItems = [
  { icon: CheckCircle2, label: "Forced captures" },
  { icon: ShieldCheck, label: "Multi-jump rules" },
  { icon: Video, label: "Pro-player videos" },
  { icon: ArrowRight, label: "Vercel-ready app" },
];

export default function Home() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 md:px-8 lg:pb-16">
        <section className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <p className="section-label">CheckerX Arena</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-white md:text-7xl">
              Every jump becomes a training signal.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A modern checkers platform for forced captures, multi-jump tactics, AI coach reviews, pro-player video tips, and city rankings.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryLink href="/play">
                <Play className="h-4 w-4" />
                Start match
              </PrimaryLink>
              <SecondaryLink href="/tips">Open Pro Tips</SecondaryLink>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {quickStats.map((stat) => (
                <Surface key={stat.label} className="p-4">
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${stat.tone === "amber" ? "text-[var(--amber)]" : "text-[var(--cyan)]"}`}>{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
                </Surface>
              ))}
            </div>
          </div>

          <Surface className="overflow-hidden p-4 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Live tactic preview</p>
                <h2 className="mt-2 text-2xl font-black text-white">Multi-jump window</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">The coach will highlight forced routes, missed captures, and king-row threats.</p>
              </div>
              <span className="rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan-soft)] px-3 py-1 text-xs font-black text-[var(--cyan)]">
                Beta
              </span>
            </div>
            <MiniCheckersBoard />
          </Surface>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {productLoops.map((item) => (
            <FeatureTile key={item.title} icon={item.icon} title={item.title} body={item.body} />
          ))}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
          <Surface>
            <p className="section-label">Product loop</p>
            <h2 className="mt-3 text-3xl font-black text-white">Learn, play, review, repeat.</h2>
            <div className="mt-6 space-y-4">
              {loopSteps.map((step) => {
                const Icon = step.icon;
                return (
                <div key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/7 text-[var(--cyan)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-black text-white">{step.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-300">{step.body}</span>
                  </span>
                </div>
                );
              })}
            </div>
          </Surface>

          <Surface>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-label">Build path</p>
                <h2 className="mt-3 text-3xl font-black text-white">Next implementation steps</h2>
              </div>
              <SecondaryLink href="/learn">View learning track</SecondaryLink>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {roadmap.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                    <Icon className="h-5 w-5 text-[var(--amber)]" />
                    <p className="mt-4 font-black text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </Surface>
        </section>

        <section className="mt-10 rounded-xl border border-[var(--cyan)]/25 bg-[linear-gradient(135deg,rgba(35,221,255,0.11),rgba(255,184,77,0.08))] p-5 md:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="section-label">Startup angle</p>
              <h2 className="mt-3 text-3xl font-black text-white">Not just a board. A checkers training system.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                CheckerX is built around retention: daily XP, city rivalry, coach feedback, pro video advice, and Pro upgrades for deeper analysis and custom skins.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryLink href="/coach">Coach demo</PrimaryLink>
              <SecondaryLink href="/pro">Founder Pro</SecondaryLink>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-4">
          {proofItems.map((item) => {
            const Icon = item.icon;
            return (
            <div key={item.label} className="flex min-h-16 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-200">
              <Icon className="h-5 w-5 text-[var(--cyan)]" />
              {item.label}
            </div>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
