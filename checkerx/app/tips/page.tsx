import { PlayCircle, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PagePrimitives";
import { tips } from "@/lib/content";

export default function TipsPage() {
  return (
    <AppShell>
      <PageHeader
        kicker="Pro Tips"
        title="Video advice by skill level."
        body="This is the unique CheckerX layer: curated YouTube lessons and short pro-player advice for every stage of growth."
      />
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-28 md:grid-cols-2 md:px-8 lg:pb-16">
        {tips.map((tip) => (
          <Surface key={tip.title} className="overflow-hidden p-0">
            <div className="grid aspect-video place-items-center bg-[linear-gradient(135deg,rgba(215,164,73,0.18),rgba(138,96,55,0.16))]">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-[#1d1a16] text-[var(--cyan)]">
                <PlayCircle className="h-8 w-8" />
              </span>
            </div>
            <div className="p-5">
              <p className="section-label">{tip.level} / {tip.tag}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{tip.title}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-stone-400">
                <Video className="h-4 w-4 text-[var(--amber)]" />
                YouTube embed placeholder / {tip.duration}
              </p>
            </div>
          </Surface>
        ))}
      </main>
    </AppShell>
  );
}
