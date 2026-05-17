import { Medal, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PagePrimitives";
import { leaderboard } from "@/lib/content";

export default function RankingsPage() {
  return (
    <AppShell>
      <PageHeader
        kicker="City rankings"
        title="Climb your local arena."
        body="Reviewed games update rating, coach score, badges, and city rank. Supabase persistence will plug into this screen later."
      />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 md:px-8 lg:pb-16">
        <Surface className="overflow-hidden p-0">
          <div className="grid grid-cols-[4rem_1fr_0.8fr_0.8fr_1fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            <span>Rank</span>
            <span>Player</span>
            <span>City</span>
            <span>Rating</span>
            <span>Badge</span>
          </div>
          {leaderboard.map((player, index) => (
            <div key={player.name} className="grid grid-cols-[4rem_1fr_0.8fr_0.8fr_1fr] items-center gap-3 border-b border-white/8 px-4 py-4 last:border-b-0">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950/70 text-lg font-black text-white">#{index + 1}</span>
              <span>
                <span className="block font-black text-white">{player.name}</span>
                <span className="mt-1 block text-xs text-slate-500">Coach score {player.coach}</span>
              </span>
              <span className="text-sm font-bold text-slate-300">{player.city}</span>
              <span className="text-xl font-black text-white">{player.rating}</span>
              <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--amber)]/25 bg-[var(--amber-soft)] px-3 py-1 text-xs font-black text-[var(--amber)]">
                {index === 0 ? <Trophy className="h-4 w-4" /> : <Medal className="h-4 w-4" />}
                {player.badge}
              </span>
            </div>
          ))}
        </Surface>
      </main>
    </AppShell>
  );
}
