"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { LucideIcon } from "lucide-react";
import { GraduationCap, Lock, LogOut, Mail, MapPin, Save, UserRound, Video } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ensureProfile, loadMyProfile, loadRecentGames, serializeGameRecord, updateMyProfile } from "@/lib/supabase/checkerx-data";
import type { GameRecord, Profile } from "@/lib/supabase/types";
import { useI18n } from "./LanguageProvider";

const cities = ["Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe"];

const skillLevels = [
  { value: "beginner", labelKey: "account.level.beginner", tipKey: "tips.beginner", href: "/tips" },
  { value: "intermediate", labelKey: "account.level.intermediate", tipKey: "tips.intermediate", href: "/tips" },
  { value: "advanced", labelKey: "account.level.advanced", tipKey: "tips.advanced", href: "/tips" },
  { value: "elite", labelKey: "account.level.elite", tipKey: "tips.elite", href: "/tips" },
];

export function AccountPanel() {
  const { t } = useI18n();
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [games, setGames] = useState<GameRecord[]>([]);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("CheckerX Player");
  const [city, setCity] = useState("Almaty");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [message, setMessage] = useState(t("account.messageDefault"));
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const nextProfile = await loadMyProfile();
      const nextGames = await loadRecentGames();
      setProfile(nextProfile);
      setGames(nextGames);

      if (nextProfile) {
        setUsername(nextProfile.username);
        setCity(nextProfile.city);
        setSkillLevel(nextProfile.skill_level ?? "beginner");
        window.localStorage.setItem("checkerx-account-label", nextProfile.username);
        window.dispatchEvent(new Event("checkerx-account-changed"));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("account.loadError"));
    }
  }, [t]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let active = true;

    async function refreshInitial() {
      const { data } = await client.auth.getUser();
      if (!active) {
        return;
      }

      setUser(data.user ?? null);
      if (data.user) {
        await refreshData();
      }
    }

    void refreshInitial();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        void refreshData();
      } else {
        setProfile(null);
        setGames([]);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, refreshData]);

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMessage(t("account.notConfigured"));
      return;
    }

    setLoading(true);
    setMessage(t("account.connecting"));

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username, city, skill_level: skillLevel },
          },
        });

        if (error) {
          throw error;
        }

        await ensureProfile();
        await refreshData();
        setMessage(t("account.created"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }

        await ensureProfile();
        await refreshData();
        setMessage(t("account.signedInMessage"));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("account.authFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const nextProfile = await updateMyProfile({ username, city, skill_level: skillLevel });
      setProfile(nextProfile);
      window.localStorage.setItem("checkerx-account-label", nextProfile.username);
      window.dispatchEvent(new Event("checkerx-account-changed"));
      setMessage(t("account.profileSaved"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("account.profileSaveError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setGames([]);
    window.localStorage.removeItem("checkerx-account-label");
    window.dispatchEvent(new Event("checkerx-account-changed"));
    setMessage(t("account.signedOut"));
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="surface rounded-xl p-5">
        {user ? (
          <div className="grid min-h-72 place-items-center rounded-xl border border-white/10 bg-[#171511] p-6 text-center">
            <div>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-[var(--amber-soft)] text-2xl font-black text-[var(--amber)]">
                {profile?.avatar_initials ?? "CX"}
              </span>
              <h2 className="mt-5 text-3xl font-black text-white">{t("account.signedIn")}</h2>
              <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-stone-400">
                {t("account.signedInBody")}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex rounded-xl border border-white/10 bg-[#171511] p-1">
              {(["login", "register"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`min-h-11 flex-1 rounded-lg text-sm font-black transition ${mode === item ? "bg-[var(--amber)] text-[#211f1b]" : "text-stone-300 hover:bg-white/8"}`}
                >
                  {item === "login" ? t("account.login") : t("account.register")}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} className="mt-5 grid gap-4">
              <Field icon={Mail} label={t("account.email")}>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-white/7 px-4 text-white outline-none transition placeholder:text-stone-500 focus:border-[var(--amber)]"
                  required
                />
              </Field>

              <Field icon={Lock} label={t("account.password")}>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder={t("account.passwordPlaceholder")}
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-white/7 px-4 text-white outline-none transition placeholder:text-stone-500 focus:border-[var(--amber)]"
                  minLength={6}
                  required
                />
              </Field>

              {mode === "register" ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <Field icon={UserRound} label={t("account.playerName")}>
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="min-h-12 w-full rounded-lg border border-white/10 bg-white/7 px-4 text-white outline-none transition focus:border-[var(--amber)]"
                      required
                    />
                  </Field>
                  <Field icon={MapPin} label={t("account.city")}>
                    <select
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="min-h-12 w-full rounded-lg border border-white/10 bg-[#171511] px-4 text-white outline-none transition focus:border-[var(--amber)]"
                    >
                      {cities.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field icon={GraduationCap} label={t("account.level")}>
                    <select
                      value={skillLevel}
                      onChange={(event) => setSkillLevel(event.target.value)}
                      className="min-h-12 w-full rounded-lg border border-white/10 bg-[#171511] px-4 text-white outline-none transition focus:border-[var(--amber)]"
                    >
                      {skillLevels.map((item) => (
                        <option key={item.value} value={item.value}>
                          {t(item.labelKey)}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-5 text-sm font-black text-[#211f1b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {mode === "login" ? t("account.login") : t("account.create")}
              </button>
            </form>
          </>
        )}

        <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold leading-6 text-stone-300">{message}</p>
      </div>

      <div className="grid gap-5">
        <div className="surface rounded-xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label">{t("account.profile")}</p>
              <h2 className="mt-2 flex flex-wrap items-center gap-3 text-3xl font-black text-white">
                {profile?.username ?? t("account.guest")}
                {profile?.elite_user ? <span className="rounded-lg border border-[var(--amber)]/25 bg-[var(--amber-soft)] px-3 py-1 text-xs font-black text-[var(--amber)]">{t("shell.elite")}</span> : null}
              </h2>
              <p className="mt-2 text-sm font-semibold text-stone-400">{user?.email ?? t("account.loginToSync")}</p>
            </div>
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                {t("account.signOut")}
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <Stat label={t("stats.todayXp")} value={String(profile?.today_xp ?? 0)} />
            <Stat label={t("stats.rating")} value={String(profile?.rating ?? 1200)} />
            <Stat label={t("stats.coach")} value={String(profile?.coach_score ?? 50)} />
            <Stat label={t("stats.streak")} value={`${profile?.current_streak ?? 0}${t("stats.days")}`} />
          </div>

          {profile ? (
            <form onSubmit={handleSaveProfile} className="mt-5 grid gap-4 md:grid-cols-[1fr_12rem_12rem_auto] md:items-end">
              <Field icon={UserRound} label={t("account.playerName")}>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-white/7 px-4 text-white outline-none transition focus:border-[var(--amber)]"
                />
              </Field>
              <Field icon={MapPin} label={t("account.city")}>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-[#171511] px-4 text-white outline-none transition focus:border-[var(--amber)]"
                >
                  {cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field icon={GraduationCap} label={t("account.level")}>
                <select
                  value={skillLevel}
                  onChange={(event) => setSkillLevel(event.target.value)}
                  className="min-h-12 w-full rounded-lg border border-white/10 bg-[#171511] px-4 text-white outline-none transition focus:border-[var(--amber)]"
                >
                  {skillLevels.map((item) => (
                    <option key={item.value} value={item.value}>
                      {t(item.labelKey)}
                    </option>
                  ))}
                </select>
              </Field>
              <button type="submit" disabled={loading} className="min-h-12 rounded-lg border border-white/10 bg-white/7 px-4 text-sm font-black text-white transition hover:bg-white/12">
                {t("account.save")}
              </button>
            </form>
          ) : null}

          {profile ? <TipsRecommendation level={profile.skill_level ?? skillLevel} /> : null}
        </div>

        <div className="surface rounded-xl p-5">
          <p className="section-label">{t("account.recentGames")}</p>
          <div className="mt-4 grid gap-2">
            {games.length === 0 ? (
              <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-semibold text-stone-400">
                {t("account.noGames")}
              </p>
            ) : (
              games.map((game) => {
                const item = serializeGameRecord(game);
                const modeLabel = game.mode === "local" ? t("account.gameLocal") : t("game.bot");
                const opponentLabel = game.bot_level ? t(`game.level.${game.bot_level}.title`) : t("account.gameLocal");
                const winnerLabel = game.winner ? (game.winner === "light" ? t("game.white") : t("game.black")) : t("account.gameSaved");

                return (
                  <div key={game.id} className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.045] p-4 md:grid-cols-[1fr_auto] md:items-center">
                    <span>
                      <span className="block font-black text-white">{modeLabel} / {opponentLabel} / {winnerLabel}</span>
                      <span className="mt-1 block text-xs font-semibold text-stone-400">
                        {t("account.gameMeta", { date: item.createdLabel, moves: game.move_count, accuracy: game.accuracy ?? 0 })}
                      </span>
                    </span>
                    <span className="rounded-lg bg-[var(--amber-soft)] px-3 py-2 text-sm font-black text-[var(--amber)]">
                      +{game.xp_earned} XP
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center gap-2 text-sm font-black text-stone-200">
        <Icon className="h-4 w-4 text-[var(--amber)]" />
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171511] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function TipsRecommendation({ level }: { level: string }) {
  const { t } = useI18n();
  const recommendation = skillLevels.find((item) => item.value === level) ?? skillLevels[0];

  return (
    <div className="mt-5 rounded-xl border border-[var(--amber)]/25 bg-[var(--amber-soft)] p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--amber)]">
        <Video className="h-4 w-4" />
        {t("account.recommended")}
      </p>
      <h3 className="mt-3 text-xl font-black text-white">{t(recommendation.labelKey)}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-stone-300">{t(recommendation.tipKey)}</p>
      <a
        href={recommendation.href}
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#171511] px-4 text-sm font-black text-white transition hover:bg-black/50"
      >
        {t("account.openTips")}
      </a>
    </div>
  );
}
