"use client";

import { ArrowRight, Brain, CheckCircle2, MoveDiagonal, Play, ShieldCheck, Sparkles, Trophy, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MiniCheckersBoard } from "@/components/MiniCheckersBoard";
import { FeatureTile, PrimaryLink, SecondaryLink, Surface } from "@/components/PagePrimitives";
import { ProfileStats } from "@/components/ProfileStats";
import { useI18n } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useI18n();

  const loopSteps = [
    { title: t("home.learn.title"), body: t("home.learn.body"), icon: MoveDiagonal },
    { title: t("home.play.title"), body: t("home.play.body"), icon: Sparkles },
    { title: t("home.review.title"), body: t("home.review.body"), icon: Brain },
    { title: t("home.climb.title"), body: t("home.climb.body"), icon: Trophy },
  ];

  const productTiles = [
    { icon: MoveDiagonal, title: t("home.proof.captures"), body: t("home.learn.body") },
    { icon: Brain, title: t("nav.coach"), body: t("home.review.body") },
    { icon: Video, title: t("nav.tips"), body: t("home.proof.videos") },
  ];

  const proofItems = [
    { icon: CheckCircle2, label: t("home.proof.captures") },
    { icon: ShieldCheck, label: t("home.proof.multijump") },
    { icon: Video, label: t("home.proof.videos") },
    { icon: ArrowRight, label: t("home.proof.vercel") },
  ];

  const roadmap = [
    { icon: Sparkles, title: t("home.roadmap.now.title"), body: t("home.roadmap.now.body") },
    { icon: MoveDiagonal, title: t("home.roadmap.next.title"), body: t("home.roadmap.next.body") },
    { icon: Brain, title: t("home.roadmap.then.title"), body: t("home.roadmap.then.body") },
  ];

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-[1480px] px-4 pb-28 pt-8 md:px-8 lg:min-h-screen lg:px-12 lg:pb-20 lg:pt-14">
        <section className="grid items-center gap-10 lg:min-h-[680px] lg:grid-cols-[minmax(430px,0.9fr)_minmax(420px,1fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <MiniCheckersBoard className="lg:max-w-[610px]" />
              <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-black/30 bg-[#201d19] px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.28)] sm:flex">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--coral)] text-lg font-black text-white">?</span>
                <span className="text-sm font-black text-stone-100">{t("home.coachQuestion")}</span>
              </div>
            </div>
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <p className="section-label">{t("home.kicker")}</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              {t("home.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-stone-300 lg:mx-0">
              {t("home.body")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <PrimaryLink href="/play">
                <Play className="h-4 w-4" />
                {t("home.start")}
              </PrimaryLink>
              <SecondaryLink href="/tips">{t("nav.tips")}</SecondaryLink>
            </div>

            <ProfileStats />
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {productTiles.map((item) => (
            <FeatureTile key={item.title} icon={item.icon} title={item.title} body={item.body} />
          ))}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
          <Surface>
            <p className="section-label">{t("home.loopKicker")}</p>
            <h2 className="mt-3 text-3xl font-black text-white">{t("home.loopTitle")}</h2>
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
                <p className="section-label">{t("home.buildKicker")}</p>
                <h2 className="mt-3 text-3xl font-black text-white">{t("home.buildTitle")}</h2>
              </div>
              <SecondaryLink href="/learn">{t("home.learningTrack")}</SecondaryLink>
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
              <p className="section-label">{t("home.startupKicker")}</p>
              <h2 className="mt-3 text-3xl font-black text-white">{t("home.startupTitle")}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">{t("home.startupBody")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryLink href="/coach">{t("home.coachDemo")}</PrimaryLink>
              <SecondaryLink href="/pro">{t("shell.elite")}</SecondaryLink>
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
