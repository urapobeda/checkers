"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Focus, Gauge, Sparkles, Trophy } from "lucide-react";
import { activateEliteDemo, loadMyProfile } from "@/lib/supabase/checkerx-data";
import type { Profile } from "@/lib/supabase/types";
import { Surface } from "./PagePrimitives";
import { useI18n } from "./LanguageProvider";

export function ElitePanel() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState(t("elite.default"));
  const [loading, setLoading] = useState(false);

  const benefits = [
    { icon: Gauge, title: t("elite.benefit.review.title"), body: t("elite.benefit.review.body") },
    { icon: Focus, title: t("elite.benefit.drills.title"), body: t("elite.benefit.drills.body") },
    { icon: Trophy, title: t("elite.benefit.badge.title"), body: t("elite.benefit.badge.body") },
    { icon: Crown, title: t("elite.benefit.skins.title"), body: t("elite.benefit.skins.body") },
  ];

  useEffect(() => {
    let active = true;

    loadMyProfile()
      .then((nextProfile) => {
        if (active) {
          setProfile(nextProfile);
          if (nextProfile?.elite_user) {
            setMessage(t("elite.activeMessage"));
          }
        }
      })
      .catch(() => {
        if (active) {
          setMessage(t("elite.loginMessage"));
        }
      });

    return () => {
      active = false;
    };
  }, [t]);

  async function handleActivate() {
    setLoading(true);
    setMessage(t("elite.activating"));

    try {
      const result = await activateEliteDemo();
      if (!result.ok) {
        setMessage(t("elite.loginFirst"));
        return;
      }

      setProfile(result.profile);
      setMessage(t("elite.activated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("elite.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-28 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:pb-16">
      <Surface>
        <p className="flex items-center gap-2 text-xl font-black text-white">
          <Crown className="h-5 w-5 text-[var(--amber)]" />
          {t("elite.demo")}
        </p>
        <p className="mt-4 text-5xl font-black text-white">$9<span className="text-base font-bold text-stone-400">{t("elite.priceSuffix")}</span></p>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          {t("elite.body")}
        </p>

        <div className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-[#171511] p-4">
          <p className="section-label">{t("elite.currentStatus")}</p>
          <p className="text-2xl font-black text-white">{profile?.elite_user ? t("elite.active") : t("elite.free")}</p>
          <p className="text-sm font-semibold leading-6 text-stone-400">{message}</p>
        </div>

        <button
          type="button"
          onClick={handleActivate}
          disabled={loading || Boolean(profile?.elite_user)}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-5 text-sm font-black text-[#211f1b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Sparkles className="h-4 w-4" />
          {profile?.elite_user ? t("elite.already") : t("elite.activate")}
        </button>
      </Surface>

      <section className="grid gap-4 md:grid-cols-2">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <Surface key={benefit.title}>
              <Icon className="h-5 w-5 text-[var(--cyan)]" />
              <h2 className="mt-4 text-xl font-black text-white">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-300">{benefit.body}</p>
            </Surface>
          );
        })}
      </section>

      <Surface className="lg:col-span-2">
        <div className="grid gap-3 md:grid-cols-4">
          {["elite.feature.payment", "elite.feature.badge", "elite.feature.skins", "elite.feature.coach"].map((item) => (
            <span key={item} className="flex min-h-14 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-bold text-stone-200">
              <Check className="h-4 w-4 text-[var(--cyan)]" />
              {t(item)}
            </span>
          ))}
        </div>
      </Surface>
    </main>
  );
}
