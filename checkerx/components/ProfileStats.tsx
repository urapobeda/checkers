"use client";

import { useEffect, useState } from "react";
import { loadLeaderboard, loadMyProfile } from "@/lib/supabase/checkerx-data";
import type { Profile } from "@/lib/supabase/types";
import { Surface } from "./PagePrimitives";
import { useI18n } from "./LanguageProvider";

export function ProfileStats() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cityRank, setCityRank] = useState<string>("");

  useEffect(() => {
    let active = true;

    loadMyProfile()
      .then(async (nextProfile) => {
        if (!active || !nextProfile) {
          return;
        }

        setProfile(nextProfile);
        const cityPlayers = await loadLeaderboard(nextProfile.city);
        const index = cityPlayers.findIndex((player) => player.id === nextProfile.id);
        if (active) {
          setCityRank(index >= 0 ? `#${index + 1} ${nextProfile.city}` : "");
        }
      })
      .catch(() => {
        if (active) {
          setProfile(null);
          setCityRank("");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = profile
    ? [
        { label: t("stats.todayXp"), value: `${profile.today_xp} / 80`, tone: "cyan" },
        { label: t("stats.streak"), value: `${profile.current_streak} ${t("stats.days")}`, tone: "amber" },
        { label: t("stats.cityRank"), value: cityRank || t("stats.unranked"), tone: "cyan" },
      ]
    : [
        { label: t("stats.todayXp"), value: "0 / 80", tone: "cyan" },
        { label: t("stats.streak"), value: `0 ${t("stats.days")}`, tone: "amber" },
        { label: t("stats.cityRank"), value: t("stats.unranked"), tone: "cyan" },
      ];

  return (
    <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3 lg:mx-0">
      {stats.map((stat) => (
        <Surface key={stat.label} className="p-4 text-left">
          <p className={`text-xs font-black uppercase tracking-[0.18em] ${stat.tone === "amber" ? "text-[var(--amber)]" : "text-[var(--cyan)]"}`}>{stat.label}</p>
          <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
        </Surface>
      ))}
    </div>
  );
}
