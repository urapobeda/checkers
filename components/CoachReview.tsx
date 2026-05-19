"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Brain, CheckCircle2, Lightbulb, RefreshCw, Target } from "lucide-react";
import { loadLatestGame, loadMyProfile, serializeGameRecord, type MovePayload } from "@/lib/supabase/checkerx-data";
import type { GameRecord, Profile } from "@/lib/supabase/types";
import { MiniCheckersBoard } from "./MiniCheckersBoard";
import { PrimaryLink, Surface } from "./PagePrimitives";
import { useI18n } from "./LanguageProvider";

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function CoachReview() {
  const { t } = useI18n();
  const [game, setGame] = useState<GameRecord | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState(t("coach.loading"));
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [nextProfile, nextGame] = await Promise.all([loadMyProfile(), loadLatestGame()]);
      setProfile(nextProfile);
      setGame(nextGame);
      setMessage(nextGame ? t("coach.loaded") : t("coach.noGame"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("coach.loginFirst"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    Promise.all([loadMyProfile(), loadLatestGame()])
      .then(([nextProfile, nextGame]) => {
        if (!active) {
          return;
        }

        setProfile(nextProfile);
        setGame(nextGame);
        setMessage(nextGame ? t("coach.loaded") : t("coach.noGame"));
      })
      .catch((error) => {
        if (active) {
          setMessage(error instanceof Error ? error.message : t("coach.loginFirst"));
        }
      });

    return () => {
      active = false;
    };
  }, [t]);

  const moves = useMemo(() => readMoves(game), [game]);
  const analysis = useMemo(() => buildAnalysis(game, moves, t), [game, moves, t]);
  const serialized = game ? serializeGameRecord(game) : null;
  const savedGameMode = game?.mode === "local" ? t("account.gameLocal") : t("game.bot");
  const savedOpponent = game?.bot_level ? t(`game.level.${game.bot_level}.title`) : t("account.gameLocal");
  const savedWinner = game?.winner ? (game.winner === "light" ? t("game.white") : t("game.black")) : t("account.gameSaved");
  const savedGameLabel = game ? `${savedGameMode} / ${savedOpponent}` : t("coach.noGameLoaded");

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-28 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-16">
      <section className="grid gap-4">
        <Surface className="p-4 md:p-6">
          <MiniCheckersBoard />
        </Surface>
        <Surface>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label">{t("coach.savedMatch")}</p>
              <h2 className="mt-3 text-3xl font-black text-white">{savedGameLabel}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">
                {serialized ? t("coach.gameMeta", { date: serialized.createdLabel, moves: game?.move_count ?? 0, winner: savedWinner }) : message}
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/6 text-white transition hover:bg-white/10 disabled:opacity-60"
              aria-label={t("coach.refresh")}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </Surface>
      </section>

      <section className="grid gap-4">
        <Surface>
          <p className="section-label">{t("coach.verdict")}</p>
          <h2 className="mt-3 text-3xl font-black text-white">{t("coach.accuracy", { accuracy: analysis.accuracy })}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">{analysis.summary}</p>
        </Surface>

        {analysis.cards.map((card) => {
          const Icon = card.icon;
          return (
            <Surface key={card.title} className="grid grid-cols-[3rem_1fr] gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--cyan-soft)] text-[var(--cyan)]">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xl font-black text-white">{card.title}</span>
                <span className="mt-1 block text-sm leading-6 text-stone-300">{card.body}</span>
              </span>
            </Surface>
          );
        })}

        <Surface>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label">{t("coach.timeline")}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{t("coach.whatChanged")}</h2>
            </div>
            <span className="rounded-lg border border-[var(--amber)]/25 bg-[var(--amber-soft)] px-3 py-1 text-xs font-black text-[var(--amber)]">
              {profile?.elite_user ? t("coach.eliteReview") : t("coach.basicReview")}
            </span>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto pr-1">
            {moves.length === 0 ? (
              <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-semibold text-stone-400">
                {t("coach.saveToUnlock")}
              </p>
            ) : (
              moves.map((move, index) => (
                <div key={`${move.notation}-${index}`} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2">
                  <span className="text-xs font-black text-stone-500">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-black text-white">{move.notation}</span>
                    <span className="block text-xs font-semibold text-stone-400">
                      {move.player === "light" ? t("game.white") : t("game.black")} / {move.source === "bot" ? t("game.botSource") : t("game.human")}
                    </span>
                  </span>
                  <span className={`rounded-md px-2 py-1 text-xs font-black ${move.captures > 0 ? "bg-[var(--amber-soft)] text-[var(--amber)]" : "bg-white/7 text-stone-400"}`}>
                    {move.captures > 0 ? `x${move.captures}` : t("coach.quiet")}
                  </span>
                </div>
              ))
            )}
          </div>
        </Surface>

        {profile?.elite_user ? (
          <PrimaryLink href="/learn">
            <Brain className="h-4 w-4" />
            {t("coach.startDrill")}
          </PrimaryLink>
        ) : (
          <PrimaryLink href="/pro">
            <Brain className="h-4 w-4" />
            {t("coach.unlockDeep")}
          </PrimaryLink>
        )}
      </section>
    </main>
  );
}

function readMoves(game: GameRecord | null): MovePayload[] {
  if (!game || !Array.isArray(game.moves)) {
    return [];
  }

  return game.moves.filter((move): move is MovePayload => {
    if (!move || typeof move !== "object" || Array.isArray(move)) {
      return false;
    }

    return "notation" in move && "player" in move && "source" in move && "captures" in move;
  });
}

function buildAnalysis(game: GameRecord | null, moves: MovePayload[], t: Translate) {
  if (!game) {
    return {
      accuracy: 0,
      summary: t("coach.noGameSummary"),
      cards: [
        { icon: Target, title: t("coach.nextAction"), body: t("coach.nextActionBody") },
      ],
    };
  }

  const captureMoves = moves.filter((move) => move.captures > 0);
  const quietMoves = moves.length - captureMoves.length;
  const bestCapture = captureMoves.sort((a, b) => b.captures - a.captures)[0];
  const accuracy = game.accuracy ?? Math.max(50, Math.min(96, 82 + captureMoves.length * 3 - quietMoves));
  const summary = game.winner === "light" ? t("coach.summary.light") : game.winner === "dark" ? t("coach.summary.dark") : t("coach.summary.draw");
  const missed = game.missed_captures ?? Math.max(0, quietMoves - 4);

  return {
    accuracy,
    summary,
    cards: [
      {
        icon: missed > 0 ? AlertTriangle : CheckCircle2,
        title: missed > 0 ? t("coach.quietRisk") : t("coach.captureDiscipline"),
        body: missed > 0 ? t("coach.quietRiskBody", { count: missed }) : t("coach.captureBody"),
      },
      {
        icon: Lightbulb,
        title: bestCapture ? t("coach.bestMoment", { notation: bestCapture.notation }) : t("coach.buildForcing"),
        body: bestCapture ? t("coach.bestMomentBody", { count: bestCapture.captures }) : t("coach.noCaptureBody"),
      },
      {
        icon: Target,
        title: t("coach.recommendedDrill"),
        body: missed > 0 ? t("coach.drillMulti") : t("coach.drillKing"),
      },
    ],
  };
}
