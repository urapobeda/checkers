"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bot, Brain, Crown, RefreshCw, RotateCcw, Save, ShieldCheck, UserRound, Zap } from "lucide-react";
import {
  applyMove,
  chooseBotMove,
  createInitialBoard,
  getLegalMoves,
  getWinner,
  otherPlayer,
  positionsEqual,
  type Board,
  type BotLevel,
  type Move,
  type Player,
  type Position,
} from "@/lib/checkers";
import { saveGameResult } from "@/lib/supabase/checkerx-data";
import type { Json } from "@/lib/supabase/types";
import { useI18n } from "./LanguageProvider";

type GameMode = "bot" | "local";

type HistoryItem = {
  move: Move;
  player: Player;
  source: "human" | "bot";
};

const levelIcons: Record<BotLevel, LucideIcon> = {
  beginner: Zap,
  club: ShieldCheck,
  elite: Brain,
};

export function CheckersGame() {
  const { t } = useI18n();
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("light");
  const [selected, setSelected] = useState<Position | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<GameMode>("bot");
  const [botLevel, setBotLevel] = useState<BotLevel>("club");
  const [botThinking, setBotThinking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(t("game.saveDefault"));

  const legalMoves = useMemo(() => (winner ? [] : getLegalMoves(board, currentPlayer)), [board, currentPlayer, winner]);
  const selectedMoves = useMemo(
    () => (selected ? legalMoves.filter((move) => positionsEqual(move.from, selected)) : []),
    [legalMoves, selected],
  );
  const mustCapture = legalMoves.some((move) => move.captures.length > 0);
  const pieceStats = useMemo(() => getPieceStats(board), [board]);

  useEffect(() => {
    if (mode !== "bot" || currentPlayer !== "dark" || winner) {
      return;
    }

    const timer = window.setTimeout(() => {
      const botMove = chooseBotMove(board, "dark", botLevel);

      if (!botMove) {
        setWinner("light");
        setBotThinking(false);
        return;
      }

      const nextBoard = applyMove(board, botMove);
      const nextPlayer = "light";
      setBoard(nextBoard);
      setCurrentPlayer(nextPlayer);
      setWinner(getWinner(nextBoard, nextPlayer));
      setSelected(null);
      setHistory((items) => [...items, { move: botMove, player: "dark", source: "bot" }]);
      setBotThinking(false);
    }, botLevel === "elite" ? 620 : 420);

    return () => {
      window.clearTimeout(timer);
    };
  }, [board, botLevel, currentPlayer, mode, winner]);

  function resetGame(nextMode = mode) {
    setBoard(createInitialBoard());
    setCurrentPlayer("light");
    setSelected(null);
    setWinner(null);
    setHistory([]);
    setMode(nextMode);
    setBotThinking(false);
    setSaveMessage(t("game.saveDefault"));
  }

  function commitHumanMove(move: Move) {
    const nextBoard = applyMove(board, move);
    const nextPlayer = otherPlayer(currentPlayer);
    const nextWinner = getWinner(nextBoard, nextPlayer);
    setBoard(nextBoard);
    setCurrentPlayer(nextPlayer);
    setWinner(nextWinner);
    setSelected(null);
    setBotThinking(mode === "bot" && nextPlayer === "dark" && !nextWinner);
    setHistory((items) => [...items, { move, player: currentPlayer, source: "human" }]);
  }

  function handleSquareClick(position: Position) {
    if (winner || botThinking || (mode === "bot" && currentPlayer === "dark")) {
      return;
    }

    const destinationMove = selectedMoves.find((move) => positionsEqual(move.to, position));
    if (destinationMove) {
      commitHumanMove(destinationMove);
      return;
    }

    const piece = board[position.row][position.col];
    const pieceHasMove = legalMoves.some((move) => positionsEqual(move.from, position));

    if (piece?.player === currentPlayer && pieceHasMove) {
      setSelected(position);
      return;
    }

    setSelected(null);
  }

  async function handleSaveGame() {
    if (history.length === 0) {
      setSaveMessage(t("game.oneMoveRequired"));
      return;
    }

    setSaving(true);
    setSaveMessage(t("game.saving"));

    try {
      const result = await saveGameResult({
        mode,
        botLevel: mode === "bot" ? botLevel : null,
        winner,
        moves: history.map((item) => ({
          notation: item.move.notation,
          player: item.player,
          source: item.source,
          captures: item.move.captures.length,
        })),
        finalBoard: board as unknown as Json,
      });

      if (!result.ok) {
        setSaveMessage(t("game.loginToSave"));
        return;
      }

      setSaveMessage(t("game.saved", { xp: result.xpEarned, delta: `${result.ratingDelta >= 0 ? "+" : ""}${result.ratingDelta}` }));
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : t("game.saveError"));
    } finally {
      setSaving(false);
    }
  }

  const getPlayerLabel = (player: Player) => (player === "light" ? t("game.white") : t("game.black"));
  const getLevelTitle = (level: BotLevel) => t(`game.level.${level}.title`);
  const getLevelBody = (level: BotLevel) => t(`game.level.${level}.body`);
  const status = winner
    ? t("game.wins", { player: getPlayerLabel(winner) })
    : botThinking
      ? t("game.botThinking", { bot: getLevelTitle(botLevel) })
      : t("game.toMove", { player: getPlayerLabel(currentPlayer) });

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(520px,0.95fr)_minmax(360px,0.65fr)]">
      <div className="surface rounded-xl p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-label">{t("game.liveBoard")}</p>
            <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">{status}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => resetGame("bot")}
              className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-black transition ${mode === "bot" ? "bg-[var(--amber)] text-[#211f1b]" : "border border-white/10 bg-white/6 text-white hover:bg-white/10"}`}
            >
              <Bot className="h-4 w-4" />
              {t("game.bot")}
            </button>
            <button
              type="button"
              onClick={() => resetGame("local")}
              className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-black transition ${mode === "local" ? "bg-[var(--amber)] text-[#211f1b]" : "border border-white/10 bg-white/6 text-white hover:bg-white/10"}`}
            >
              <UserRound className="h-4 w-4" />
              {t("game.twoPlayers")}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_12rem]">
          <div className="mx-auto w-full max-w-[640px] rounded-2xl border border-black/35 bg-[#1d1a16] p-2 shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
            <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-xl border border-black/45">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const position = { row: rowIndex, col: colIndex };
                  const playable = (rowIndex + colIndex) % 2 === 1;
                  const isSelected = selected ? positionsEqual(selected, position) : false;
                  const isTarget = selectedMoves.some((move) => positionsEqual(move.to, position));
                  const isMovable = legalMoves.some((move) => positionsEqual(move.from, position));
                  const wasCaptured = selectedMoves.some((move) => move.captures.some((capture) => positionsEqual(capture, position)));

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => handleSquareClick(position)}
                      disabled={!playable || Boolean(winner) || botThinking}
                      className={`relative grid aspect-square place-items-center transition ${playable ? "bg-[var(--board-dark)]" : "bg-[var(--board-light)]"} ${playable && !winner ? "hover:brightness-110" : ""}`}
                      aria-label={`Square ${rowIndex}-${colIndex}`}
                    >
                      {isSelected ? <span className="absolute inset-1 rounded-md border-2 border-[var(--amber)] bg-[var(--amber)]/10" /> : null}
                      {isTarget ? <span className="absolute h-[30%] w-[30%] rounded-full bg-[#1d1a16]/45 ring-2 ring-[var(--amber)]" /> : null}
                      {wasCaptured ? <span className="absolute inset-2 rounded-md border border-[var(--coral)]/70 bg-[var(--coral)]/12" /> : null}
                      {piece ? (
                        <span
                          className={`relative grid aspect-square w-[68%] place-items-center rounded-full border shadow-[0_9px_18px_rgba(0,0,0,0.38)] transition ${isMovable ? "scale-105 ring-2 ring-[var(--amber)]/55" : ""} ${piece.player === "light" ? "border-white/70 bg-[linear-gradient(145deg,#fff6dd,#d7bd86)]" : "border-stone-700 bg-[linear-gradient(145deg,#47423b,#15130f)]"}`}
                        >
                          <span className={`aspect-square w-[46%] rounded-full border ${piece.player === "light" ? "border-[#b08a4c] bg-white/20" : "border-white/15 bg-white/15"}`} />
                          {piece.king ? <span className="absolute top-[17%] h-1.5 w-[38%] rounded-full bg-[var(--amber)] shadow-[0_0_0_1px_rgba(0,0,0,0.22)]" /> : null}
                        </span>
                      ) : null}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <InfoCard label={t("game.rule")} value={mustCapture ? t("game.captureRequired") : t("game.freeMove")} tone={mustCapture ? "danger" : "normal"} />
            <InfoCard label={t("game.legalMoves")} value={String(legalMoves.length)} />
            <InfoCard label={t("game.whitePieces")} value={String(pieceStats.light)} />
            <InfoCard label={t("game.blackPieces")} value={String(pieceStats.dark)} />
          </div>
        </div>
      </div>

      <aside className="grid gap-4">
        <div className="surface rounded-xl p-5">
          <p className="section-label">{t("game.trainingBot")}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{t("game.chooseDifficulty")}</h2>
          <div className="mt-4 grid gap-2">
            {(Object.keys(levelIcons) as BotLevel[]).map((level) => {
              const Icon = levelIcons[level];
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setBotLevel(level)}
                  className={`grid min-h-16 grid-cols-[2.5rem_1fr] items-center gap-3 rounded-lg border px-3 text-left transition ${botLevel === level ? "border-[var(--amber)] bg-[var(--amber-soft)]" : "border-white/10 bg-white/6 hover:bg-white/10"}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#1d1a16] text-[var(--amber)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-black text-white">{getLevelTitle(level)}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-stone-400">{getLevelBody(level)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="surface rounded-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-label">{t("game.moveLog")}</p>
              <h2 className="mt-2 text-2xl font-black text-white">{t("game.history")}</h2>
            </div>
            <button
              type="button"
              onClick={() => resetGame()}
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/6 text-white transition hover:bg-white/10"
              aria-label={t("game.reset")}
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-semibold leading-6 text-stone-400">
                {t("game.firstMoveHint")}
              </p>
            ) : (
              history.map((item, index) => (
                <div key={`${item.move.notation}-${index}`} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2">
                  <span className="text-xs font-black text-stone-500">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-black text-white">{item.move.notation}</span>
                    <span className="block text-xs font-semibold text-stone-400">{getPlayerLabel(item.player)} / {item.source === "bot" ? t("game.botSource") : t("game.human")}</span>
                  </span>
                  {item.move.captures.length > 0 ? (
                    <span className="rounded-md bg-[var(--coral)]/15 px-2 py-1 text-xs font-black text-[var(--coral)]">
                      x{item.move.captures.length}
                    </span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--amber)]/25 bg-[linear-gradient(135deg,rgba(215,164,73,0.14),rgba(138,96,55,0.14))] p-5">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[var(--amber)]">
            <Crown className="h-4 w-4" />
            {t("game.coachReady")}
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">
            {t("game.coachReadyBody")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSaveGame}
              disabled={saving}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-4 text-sm font-black text-[#211f1b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {t("game.saveSupabase")}
            </button>
            <button
              type="button"
              onClick={() => resetGame()}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/7 px-4 text-sm font-black text-white transition hover:bg-white/12"
            >
              <RefreshCw className="h-4 w-4" />
              {t("game.newGame")}
            </button>
          </div>
          <p className="mt-3 rounded-lg border border-white/10 bg-[#171511]/80 p-3 text-xs font-bold leading-5 text-stone-300">{saveMessage}</p>
        </div>
      </aside>
    </section>
  );
}

function InfoCard({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "danger" }) {
  return (
    <div className={`rounded-lg border p-4 ${tone === "danger" ? "border-[var(--coral)]/30 bg-[var(--coral)]/10" : "border-white/10 bg-white/[0.045]"}`}>
      <p className={`text-xs font-black uppercase tracking-[0.16em] ${tone === "danger" ? "text-[var(--coral)]" : "text-[var(--amber)]"}`}>{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function getPieceStats(board: Board) {
  return board.flat().reduce(
    (stats, piece) => {
      if (piece?.player === "light") {
        stats.light += 1;
      }
      if (piece?.player === "dark") {
        stats.dark += 1;
      }
      return stats;
    },
    { light: 0, dark: 0 },
  );
}
