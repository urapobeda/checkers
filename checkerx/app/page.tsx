import { ArrowRight, Brain, CheckCircle2, MoveDiagonal, Play, ShieldCheck, Sparkles, Trophy, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MiniCheckersBoard } from "@/components/MiniCheckersBoard";
import { FeatureTile, PrimaryLink, SecondaryLink, Surface } from "@/components/PagePrimitives";
import { productLoops, quickStats, roadmap } from "@/lib/content";

const loopSteps = [
  { title: "Learn", body: "Short lessons build the habit of checking captures first.", icon: MoveDiagonal },
  { title: "Play", body: "Train with a bot, invite a friend, or play on one device.", icon: Sparkles },
  { title: "Review", body: "The coach turns mistakes into replayable tactical cards.", icon: Brain },
  { title: "Climb", body: "Reviewed matches update city rank and Elite progress.", icon: Trophy },
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
      <main className="mx-auto w-full max-w-[1480px] px-4 pb-28 pt-8 md:px-8 lg:min-h-screen lg:px-12 lg:pb-20 lg:pt-14">
        <section className="grid items-center gap-10 lg:min-h-[680px] lg:grid-cols-[minmax(430px,0.9fr)_minmax(420px,1fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <MiniCheckersBoard className="lg:max-w-[610px]" />
              <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-black/30 bg-[#201d19] px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.28)] sm:flex">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--coral)] text-lg font-black text-white">?</span>
                <span className="text-sm font-black text-stone-100">Coach asks: where is the forced jump?</span>
              </div>
            </div>
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <p className="section-label">CheckerX Arena</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              Играйте в шашки и растите как тактик.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-stone-300 lg:mx-0">
              Онлайн-арена для шашек с обязательными взятиями, подсказками ходов, разбором ошибок и видео-советами от сильных игроков по уровням.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <PrimaryLink href="/play">
                <Play className="h-4 w-4" />
                Начать
              </PrimaryLink>
              <SecondaryLink href="/tips">Pro Tips</SecondaryLink>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3 lg:mx-0">
              {quickStats.map((stat) => (
                <Surface key={stat.label} className="p-4 text-left">
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${stat.tone === "amber" ? "text-[var(--amber)]" : "text-[var(--cyan)]"}`}>{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
                </Surface>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
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
                      <span className="mt-1 block text-sm leading-6 text-stone-300">{step.body}</span>
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
                    <p className="mt-2 text-sm leading-6 text-stone-300">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </Surface>
        </section>

        <section className="mt-10 rounded-xl border border-[var(--cyan)]/25 bg-[linear-gradient(135deg,rgba(215,164,73,0.14),rgba(138,96,55,0.16))] p-5 md:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="section-label">Startup angle</p>
              <h2 className="mt-3 text-3xl font-black text-white">Not just a board. A checkers training system.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
                CheckerX is built around retention: daily XP, city rivalry, coach feedback, pro video advice, and Elite upgrades for deeper analysis and custom skins.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryLink href="/coach">Coach demo</PrimaryLink>
              <SecondaryLink href="/pro">Elite user</SecondaryLink>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-4">
          {proofItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex min-h-16 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-stone-200">
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
