"use client";

import { useEffect, useState } from "react";
import { Medal, Trophy } from "lucide-react";
import { loadLeaderboard } from "@/lib/supabase/checkerx-data";
import type { Profile } from "@/lib/supabase/types";
import { leaderboard as demoLeaderboard } from "@/lib/content";
import { useI18n } from "./LanguageProvider";

export function LeaderboardTable() {
  const { t } = useI18n();
  const [players, setPlayers] = useState<Profile[]>([]);
  const [city, setCity] = useState("Almaty");
  const [message, setMessage] = useState(t("rankings.loading"));

  useEffect(() => {
    let active = true;

    loadLeaderboard(city)
      .then((items) => {
        if (!active) {
          return;
        }

        setPlayers(items);
        setMessage(items.length > 0 ? t("rankings.live") : t("rankings.empty"));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setPlayers([]);
        setMessage(error instanceof Error ? t("rankings.loginRequired", { message: error.message }) : t("rankings.demo"));
      });

    return () => {
      active = false;
    };
  }, [city, t]);

  const rows = players.length > 0 ? players : demoLeaderboard.map((item, index) => ({
    id: item.name,
    email: null,
    username: item.name,
    city: item.city,
    avatar_initials: item.name.slice(0, 2).toUpperCase(),
    today_xp: 0,
    total_xp: 0,
    rating: item.rating,
    coach_score: item.coach,
    current_streak: 0,
    elite_user: index < 2,
    last_active_on: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  return (
    <div className="surface overflow-hidden rounded-xl p-0">
      <div className="grid gap-4 border-b border-white/10 p-4 md:grid-cols-[1fr_14rem] md:items-center">
        <div>
          <p className="section-label">{t("rankings.liveArena")}</p>
          <p className="mt-2 text-sm font-semibold text-stone-400">{message}</p>
        </div>
        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="min-h-11 rounded-lg border border-white/10 bg-[#171511] px-4 text-sm font-black text-white outline-none"
        >
          {["Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden grid-cols-[4rem_1fr_0.8fr_0.8fr_1fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-stone-500 md:grid">
        <span>{t("rankings.rank")}</span>
        <span>{t("rankings.player")}</span>
        <span>{t("rankings.city")}</span>
        <span>{t("rankings.rating")}</span>
        <span>{t("rankings.badge")}</span>
      </div>

      {rows.map((player, index) => (
        <div key={player.id} className="grid gap-3 border-b border-white/8 px-4 py-4 last:border-b-0 md:grid-cols-[4rem_1fr_0.8fr_0.8fr_1fr] md:items-center">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#1d1a16] text-lg font-black text-white">#{index + 1}</span>
          <span>
            <span className="flex items-center gap-2 font-black text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--amber-soft)] text-xs text-[var(--amber)]">{player.avatar_initials}</span>
              {player.username}
            </span>
            <span className="mt-1 block text-xs text-stone-500">{t("rankings.coachScore", { score: player.coach_score })}</span>
          </span>
          <span className="text-sm font-bold text-stone-300">{player.city}</span>
          <span className="text-xl font-black text-white">{player.rating}</span>
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--amber)]/25 bg-[var(--amber-soft)] px-3 py-1 text-xs font-black text-[var(--amber)]">
            {index === 0 ? <Trophy className="h-4 w-4" /> : <Medal className="h-4 w-4" />}
            {player.elite_user ? t("rankings.badgeElite") : player.rating >= 1300 ? t("rankings.badgeClimber") : t("rankings.badgeNew")}
          </span>
        </div>
      ))}
    </div>
  );
}
