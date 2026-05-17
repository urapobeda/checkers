import { AlertTriangle, Brain, Lightbulb, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, PrimaryLink, Surface } from "@/components/PagePrimitives";
import { MiniCheckersBoard } from "@/components/MiniCheckersBoard";

const reviewCards = [
  { icon: AlertTriangle, title: "Missed capture", body: "You had a forced double jump, but chose a quiet move." },
  { icon: Lightbulb, title: "Better idea", body: "Start with 12x19, then continue 23x14 to win material." },
  { icon: Target, title: "Training drill", body: "Replay the position and name every capture chain before moving." },
];

export default function CoachPage() {
  return (
    <AppShell>
      <PageHeader
        kicker="AI Coach"
        title="Turn a mistake into a drill."
        body="The coach page will replay the match, find missed jumps, explain king-row threats, and recommend the next lesson."
      />
      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-28 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-16">
        <Surface className="p-4 md:p-6">
          <MiniCheckersBoard />
        </Surface>
        <section className="grid gap-4">
          <Surface>
            <p className="section-label">Coach verdict</p>
            <h2 className="mt-3 text-3xl font-black text-white">Accuracy 74%</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your structure was playable, but the biggest swing came from missing a capture chain that also opened a king path.
            </p>
          </Surface>
          {reviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <Surface key={card.title} className="grid grid-cols-[3rem_1fr] gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--cyan-soft)] text-[var(--cyan)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xl font-black text-white">{card.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-300">{card.body}</span>
                </span>
              </Surface>
            );
          })}
          <PrimaryLink href="/pro">
            <Brain className="h-4 w-4" />
            Unlock deep review
          </PrimaryLink>
        </section>
      </main>
    </AppShell>
  );
}
