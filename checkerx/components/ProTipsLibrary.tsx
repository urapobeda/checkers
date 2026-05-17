"use client";

import { ExternalLink, PlayCircle, Video } from "lucide-react";
import { tips } from "@/lib/content";
import { Surface } from "./PagePrimitives";
import { useI18n } from "./LanguageProvider";

const tipCopy = [
  { levelKey: "tips.level.beginner", tagKey: "tips.tag.rules", titleKey: "tips.card.captures.title", adviceKey: "tips.card.captures.advice" },
  { levelKey: "tips.level.club", tagKey: "tips.tag.tactics", titleKey: "tips.card.traps.title", adviceKey: "tips.card.traps.advice" },
  { levelKey: "tips.level.advanced", tagKey: "tips.tag.strategy", titleKey: "tips.card.kings.title", adviceKey: "tips.card.kings.advice" },
  { levelKey: "tips.level.pro", tagKey: "tips.tag.calculation", titleKey: "tips.card.chains.title", adviceKey: "tips.card.chains.advice" },
];

export function ProTipsLibrary() {
  const { t } = useI18n();

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-28 md:grid-cols-2 md:px-8 lg:pb-16">
      {tips.map((tip, index) => {
        const copy = tipCopy[index] ?? tipCopy[0];
        const query = encodeURIComponent(tip.query);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;

        return (
          <Surface key={tip.title} className="overflow-hidden p-0">
            <div className="relative grid aspect-video place-items-center bg-[linear-gradient(135deg,rgba(215,164,73,0.18),rgba(138,96,55,0.16))]">
              <div className="absolute inset-0 opacity-35 [background:linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.08)_25%,rgba(255,255,255,0.08)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.15)_75%)] [background-size:38px_38px]" />
              <span className="relative grid h-16 w-16 place-items-center rounded-full bg-[#1d1a16] text-[var(--cyan)] shadow-[0_18px_42px_rgba(0,0,0,0.35)]">
                <PlayCircle className="h-8 w-8" />
              </span>
            </div>
            <div className="p-5">
              <p className="section-label">{t(copy.levelKey)} / {t(copy.tagKey)}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{t(copy.titleKey)}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">{t(copy.adviceKey)}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-4 text-sm font-black text-[#211f1b] transition hover:brightness-110"
                >
                  <Video className="h-4 w-4" />
                  {t("tips.openYoutube")}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <span className="rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-xs font-black text-stone-300">{tip.duration}</span>
              </div>
            </div>
          </Surface>
        );
      })}
    </main>
  );
}
