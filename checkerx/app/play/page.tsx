import { AppShell } from "@/components/AppShell";
import { MiniCheckersBoard } from "@/components/MiniCheckersBoard";
import { PageHeader, PrimaryLink, Surface } from "@/components/PagePrimitives";
import { playModes } from "@/lib/content";

export default function PlayPage() {
  return (
    <AppShell>
      <PageHeader
        kicker="Play"
        title="Choose a match style."
        body="The first playable build will start here: local board, training bot, then friend rooms with Supabase Realtime."
      />
      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-28 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pb-16">
        <section className="grid gap-4">
          {playModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Surface key={mode.title} className="grid gap-4 md:grid-cols-[3rem_1fr_auto] md:items-center">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--cyan-soft)] text-[var(--cyan)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xl font-black text-white">{mode.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-300">{mode.body}</span>
                </span>
                <span className="rounded-lg border border-white/10 bg-white/6 px-4 py-2 text-sm font-bold text-slate-200">{mode.action}</span>
              </Surface>
            );
          })}
        </section>
        <Surface className="p-4 md:p-6">
          <p className="section-label">Board preview</p>
          <h2 className="mt-3 text-3xl font-black text-white">Rules engine comes next.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Next we will add legal moves, mandatory captures, multi-jumps, kings, victory detection, move history, and bot replies.
          </p>
          <div className="mt-6">
            <MiniCheckersBoard />
          </div>
          <div className="mt-6">
            <PrimaryLink href="/learn">Prepare lessons</PrimaryLink>
          </div>
        </Surface>
      </main>
    </AppShell>
  );
}
