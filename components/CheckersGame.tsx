"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bot, Brain, Copy, Crown, Link2, RefreshCw, RotateCcw, Save, ShieldCheck, UserRound, Users, Zap } from "lucide-react";
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
import { createRoom, joinRoom, saveGameResult, subscribeToRoom, updateRoomState } from "@/lib/supabase/checkerx-data";
import type { Json, RoomRecord } from "@/lib/supabase/types";
import { useI18n } from "./LanguageProvider";

type GameMode = "bot" | "room";
type PlayPanel = "menu" | "online" | "bot" | "friend";

type HistoryItem = {
  move: Move;
  player: Player;
  source: "human" | "bot";
};

type PlayerSlotInfo = {
  label: string;
  title: string;
  body: string;
  kind: "you" | "bot" | "friend" | "empty";
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
  const [activePanel, setActivePanel] = useState<PlayPanel>(() => (readInitialRoomCode() ? "friend" : "menu"));
  const [botLevel, setBotLevel] = useState<BotLevel>("club");
  const [botThinking, setBotThinking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(t("game.saveDefault"));
  const [matchStarted, setMatchStarted] = useState(false);
  const [room, setRoom] = useState<RoomRecord | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState(() => readInitialRoomCode());
  const [roomMessage, setRoomMessage] = useState(() => {
    const initialRoomCode = readInitialRoomCode();
    return initialRoomCode ? t("room.linkDetected", { code: initialRoomCode }) : t("room.default");
  });
  const [roomLoading, setRoomLoading] = useState(false);
  const [playerSeat, setPlayerSeat] = useState<Player | null>(null);
  const [shareLink, setShareLink] = useState("");

  const legalMoves = useMemo(() => (winner ? [] : getLegalMoves(board, currentPlayer)), [board, currentPlayer, winner]);
  const selectedMoves = useMemo(
    () => (selected ? legalMoves.filter((move) => positionsEqual(move.from, selected)) : []),
    [legalMoves, selected],
  );
  const mustCapture = legalMoves.some((move) => move.captures.length > 0);
  const pieceStats = useMemo(() => getPieceStats(board), [board]);

  useEffect(() => {
    if (!room?.id) {
      return;
    }

    const unsubscribe = subscribeToRoom(room.id, (nextRoom) => {
      applyRoomState(nextRoom);
      setRoomMessage(nextRoom.status === "active" ? t("room.synced") : t("room.waiting", { code: nextRoom.code }));
    });

    return () => {
      unsubscribe?.();
    };
  }, [room?.id, t]);

  useEffect(() => {
    if (!matchStarted || mode !== "bot" || currentPlayer !== "dark" || winner) {
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
  }, [board, botLevel, currentPlayer, matchStarted, mode, winner]);

  function clearBoardState() {
    setBoard(createInitialBoard());
    setCurrentPlayer("light");
    setSelected(null);
    setWinner(null);
    setHistory([]);
    setBotThinking(false);
    setSaveMessage(t("game.saveDefault"));
  }

  function clearRoomState() {
    setRoom(null);
    setPlayerSeat(null);
    setShareLink("");
    window.history.replaceState(null, "", "/play/");
  }

  function resetGame(nextMode: GameMode = mode, keepMatchStarted = true) {
    clearBoardState();
    setMode(nextMode);
    if (nextMode !== "room") {
      clearRoomState();
    }
    setMatchStarted(keepMatchStarted);
  }

  function selectPanel(panel: PlayPanel) {
    clearBoardState();
    clearRoomState();
    setActivePanel(panel);
    setMode(panel === "bot" ? "bot" : "room");
    setMatchStarted(false);
    setRoomCodeInput(panel === "friend" ? readInitialRoomCode() : "");

    if (panel === "online") {
      setRoomMessage(t("play.onlineReady"));
      return;
    }

    if (panel === "bot") {
      setRoomMessage(t("play.botBody"));
      return;
    }

    if (panel === "friend") {
      const code = readInitialRoomCode();
      setRoomMessage(code ? t("room.linkDetected", { code }) : t("room.default"));
      return;
    }

    setRoomMessage(t("room.default"));
  }

  function startBotMatch(level = botLevel) {
    setActivePanel("bot");
    setBotLevel(level);
    resetGame("bot");
    setPlayerSeat("light");
    setRoomMessage(t("match.botReady", { bot: getLevelTitle(level) }));
  }

  function applyRoomState(nextRoom: RoomRecord) {
    const nextBoard = readRoomBoard(nextRoom);
    const nextTurn = readRoomTurn(nextRoom);
    setRoom(nextRoom);
    setBoard(nextBoard);
    setCurrentPlayer(nextTurn);
    setHistory(readRoomHistory(nextRoom));
    setWinner(getWinner(nextBoard, nextTurn));
    setSelected(null);
    setBotThinking(false);
  }

  async function commitHumanMove(move: Move) {
    const nextBoard = applyMove(board, move);
    const nextPlayer = otherPlayer(currentPlayer);
    const nextWinner = getWinner(nextBoard, nextPlayer);
    const nextHistory = [...history, { move, player: currentPlayer, source: "human" as const }];

    setBoard(nextBoard);
    setCurrentPlayer(nextPlayer);
    setWinner(nextWinner);
    setSelected(null);
    setBotThinking(mode === "bot" && nextPlayer === "dark" && !nextWinner);
    setHistory(nextHistory);

    if (mode === "room" && room) {
      try {
        setRoomMessage(t("room.syncing"));
        const result = await updateRoomState(room.id, {
          board: nextBoard,
          currentTurn: nextPlayer,
          moves: nextHistory as unknown as Json,
          status: nextWinner ? "finished" : "active",
        });

        if (result.ok) {
          applyRoomState(result.room);
          setRoomMessage(nextWinner ? t("room.finished") : t("room.synced"));
        } else {
          setRoomMessage(t("room.notConfigured"));
        }
      } catch (error) {
        setRoomMessage(error instanceof Error ? error.message : t("room.syncError"));
      }
    }
  }

  function handleSquareClick(position: Position) {
    if (!matchStarted) {
      return;
    }

    if (winner || botThinking || (mode === "bot" && currentPlayer === "dark")) {
      return;
    }

    if (mode === "room" && (!room || room.status !== "active" || playerSeat !== currentPlayer)) {
      return;
    }

    const destinationMove = selectedMoves.find((move) => positionsEqual(move.to, position));
    if (destinationMove) {
      void commitHumanMove(destinationMove);
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

  async function handleCreateRoom(panel: "online" | "friend") {
    setActivePanel(panel);
    setMode("room");
    setRoom(null);
    setPlayerSeat(null);
    setShareLink("");
    setRoomLoading(true);
    setRoomMessage(t("room.creating"));

    try {
      const result = await createRoom();

      if (!result.ok) {
        setRoomMessage(t("room.notConfigured"));
        return;
      }

      clearBoardState();
      setPlayerSeat("light");
      setMatchStarted(true);
      applyRoomState(result.room);
      setRoomCodeInput(result.room.code);
      const nextShareLink = `${window.location.origin}/play/?room=${result.room.code}`;
      setShareLink(nextShareLink);
      window.history.replaceState(null, "", `/play/?room=${result.room.code}`);
      setRoomMessage(t(panel === "online" ? "room.createdOnline" : "room.created", { code: result.room.code }));
    } catch (error) {
      setRoomMessage(error instanceof Error ? error.message : t("room.createError"));
    } finally {
      setRoomLoading(false);
    }
  }

  async function handleJoinRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActivePanel("friend");
    setMode("room");
    setRoomLoading(true);
    setRoomMessage(t("room.joining"));

    try {
      const result = await joinRoom(roomCodeInput);

      if (!result.ok) {
        setRoomMessage(t(`room.${result.reason}`));
        return;
      }

      setPlayerSeat("dark");
      setMatchStarted(true);
      applyRoomState(result.room);
      const nextShareLink = `${window.location.origin}/play/?room=${result.room.code}`;
      setShareLink(nextShareLink);
      window.history.replaceState(null, "", `/play/?room=${result.room.code}`);
      setRoomMessage(t("room.joined", { code: result.room.code }));
    } catch (error) {
      setRoomMessage(error instanceof Error ? error.message : t("room.joinError"));
    } finally {
      setRoomLoading(false);
    }
  }

  async function handleCopyRoom() {
    if (!room) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareLink || room.code);
      setRoomMessage(t("room.copied"));
    } catch {
      setRoomMessage(t("room.copyManual", { code: room.code }));
    }
  }

  async function handleNewGame() {
    if (mode !== "room" || !room) {
      resetGame();
      return;
    }

    try {
      const nextBoard = createInitialBoard();
      const result = await updateRoomState(room.id, {
        board: nextBoard,
        currentTurn: "light",
        moves: [],
        status: room.status === "active" ? "active" : "waiting",
      });

      if (result.ok) {
        applyRoomState(result.room);
        setRoomMessage(t("room.resetDone"));
      }
    } catch (error) {
      setRoomMessage(error instanceof Error ? error.message : t("room.syncError"));
    }
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
  const roomTurnStatus =
    mode === "room" && room
      ? room.status === "waiting"
        ? t("room.waitingStatus", { code: room.code })
        : playerSeat === currentPlayer
          ? t("room.yourTurn", { player: getPlayerLabel(currentPlayer) })
          : t("room.opponentTurn", { player: getPlayerLabel(currentPlayer) })
      : null;
  const status = !matchStarted
    ? t("play.notStarted")
    : winner
      ? t("game.wins", { player: getPlayerLabel(winner) })
      : roomTurnStatus
        ? roomTurnStatus
        : botThinking
          ? t("game.botThinking", { bot: getLevelTitle(botLevel) })
          : t("game.toMove", { player: getPlayerLabel(currentPlayer) });
  const darkSlot = buildSlot("dark", mode, room, playerSeat, getLevelTitle(botLevel), activePanel, matchStarted, t);
  const lightSlot = buildSlot("light", mode, room, playerSeat, getLevelTitle(botLevel), activePanel, matchStarted, t);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(560px,0.98fr)_minmax(330px,0.42fr)]">
      <div className="surface rounded-xl p-3 md:p-4">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-label">{t("game.liveBoard")}</p>
            <h2 className="mt-1 text-xl font-black text-white md:text-2xl">{status}</h2>
          </div>
          <button
            type="button"
            onClick={() => selectPanel("menu")}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:bg-white/10 md:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            {t("match.newMatch")}
          </button>
        </div>

        <PlayerBar slot={darkSlot} timer={mode === "room" && room?.status === "waiting" ? "--:--" : "10:00"} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_11rem]">
          <div className="mx-auto w-full max-w-[720px] rounded-lg border border-black/35 bg-[#1d1a16] p-2 shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
            <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-md border border-black/45">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const position = { row: rowIndex, col: colIndex };
                  const playable = (rowIndex + colIndex) % 2 === 1;
                  const isSelected = selected ? positionsEqual(selected, position) : false;
                  const isTarget = selectedMoves.some((move) => positionsEqual(move.to, position));
                  const isMovable = matchStarted && legalMoves.some((move) => positionsEqual(move.from, position));
                  const wasCaptured = selectedMoves.some((move) => move.captures.some((capture) => positionsEqual(capture, position)));
                  const boardLocked = !matchStarted || Boolean(winner) || botThinking || (mode === "room" && (!room || room.status !== "active" || playerSeat !== currentPlayer));

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => handleSquareClick(position)}
                      disabled={!playable || boardLocked}
                      className={`relative grid aspect-square place-items-center transition ${playable ? "bg-[var(--board-dark)]" : "bg-[var(--board-light)]"} ${playable && !boardLocked ? "hover:brightness-110" : ""}`}
                      aria-label={`Square ${rowIndex}-${colIndex}`}
                    >
                      {colIndex === 0 ? <span className="absolute left-1 top-1 text-xs font-black text-[#6b8f48]">{8 - rowIndex}</span> : null}
                      {rowIndex === 7 ? <span className="absolute bottom-0.5 right-1 text-xs font-black text-[#6b8f48]">{String.fromCharCode(97 + colIndex)}</span> : null}
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

          <div className="grid gap-3 lg:content-start">
            <InfoCard label={t("game.rule")} value={mustCapture ? t("game.captureRequired") : t("game.freeMove")} tone={mustCapture ? "danger" : "normal"} />
            <InfoCard label={t("game.legalMoves")} value={matchStarted ? String(legalMoves.length) : "0"} />
            <InfoCard label={t("game.whitePieces")} value={String(pieceStats.light)} />
            <InfoCard label={t("game.blackPieces")} value={String(pieceStats.dark)} />
          </div>
        </div>

        <PlayerBar slot={lightSlot} timer="10:00" isBottom />
      </div>

      <aside className="surface rounded-xl p-4 md:p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="section-label">{t("play.panelLabel")}</p>
            <h2 className="mt-2 text-2xl font-black text-white">{getPanelTitle(activePanel, t)}</h2>
          </div>
          {activePanel !== "menu" ? (
            <button
              type="button"
              onClick={() => selectPanel("menu")}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-3 text-xs font-black text-white transition hover:bg-white/10"
            >
              {t("play.back")}
            </button>
          ) : null}
        </div>

        {activePanel === "menu" ? (
          <div className="grid gap-3">
            <ModeChoice icon={Zap} title={t("play.menuOnline")} body={t("play.menuOnlineBody")} onClick={() => selectPanel("online")} />
            <ModeChoice icon={Bot} title={t("play.menuBots")} body={t("play.menuBotsBody")} onClick={() => selectPanel("bot")} />
            <ModeChoice icon={Users} title={t("play.menuFriend")} body={t("play.menuFriendBody")} onClick={() => selectPanel("friend")} />
          </div>
        ) : null}

        {activePanel === "online" ? (
          <div className="grid gap-4">
            <p className="text-sm font-semibold leading-6 text-stone-300">{t("play.onlineBody")}</p>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <p className="section-label">{t("play.timeControlLabel")}</p>
              <p className="mt-2 text-2xl font-black text-white">{t("play.timeControl")}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleCreateRoom("online")}
              disabled={roomLoading}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-4 text-lg font-black text-[#211f1b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Zap className="h-5 w-5" />
              {t("play.startOnline")}
            </button>
            <RoomStatusCard room={room} roomMessage={roomMessage} playerSeat={playerSeat} shareLink={shareLink} getPlayerLabel={getPlayerLabel} onCopy={handleCopyRoom} t={t} />
          </div>
        ) : null}

        {activePanel === "bot" ? (
          <div className="grid gap-4">
            <p className="text-sm font-semibold leading-6 text-stone-300">{t("play.botBody")}</p>
            <div className="grid gap-2">
              <p className="section-label">{t("play.botsDifficulty")}</p>
              {(Object.keys(levelIcons) as BotLevel[]).map((level) => {
                const Icon = levelIcons[level];
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setBotLevel(level)}
                    className={`grid min-h-16 grid-cols-[2.75rem_1fr] items-center gap-3 rounded-lg border px-3 text-left transition ${botLevel === level ? "border-[var(--amber)] bg-[var(--amber-soft)]" : "border-white/10 bg-white/6 hover:bg-white/10"}`}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#171511] text-[var(--amber)]">
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
            <button
              type="button"
              onClick={() => startBotMatch(botLevel)}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-4 text-lg font-black text-[#211f1b] transition hover:brightness-110"
            >
              <Bot className="h-5 w-5" />
              {t("play.startBot")}
            </button>
          </div>
        ) : null}

        {activePanel === "friend" ? (
          <div className="grid gap-4">
            <p className="text-sm font-semibold leading-6 text-stone-300">{t("play.friendBody")}</p>
            <button
              type="button"
              onClick={() => void handleCreateRoom("friend")}
              disabled={roomLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-4 text-base font-black text-[#211f1b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Link2 className="h-5 w-5" />
              {t("play.createFriend")}
            </button>
            <form onSubmit={handleJoinRoom} className="grid gap-2">
              <input
                value={roomCodeInput}
                onChange={(event) => setRoomCodeInput(normalizeRoomCode(event.target.value))}
                placeholder={t("room.codePlaceholder")}
                className="min-h-12 rounded-lg border border-white/10 bg-[#171511] px-4 text-sm font-black uppercase tracking-[0.18em] text-white outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-stone-500 focus:border-[var(--amber)]"
              />
              <button
                type="submit"
                disabled={roomLoading}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/7 px-4 text-sm font-black text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {t("room.join")}
              </button>
            </form>
            <RoomStatusCard room={room} roomMessage={roomMessage} playerSeat={playerSeat} shareLink={shareLink} getPlayerLabel={getPlayerLabel} onCopy={handleCopyRoom} t={t} />
          </div>
        ) : null}

        {matchStarted ? (
          <div className="mt-5 rounded-lg border border-[var(--amber)]/25 bg-[var(--amber-soft)] p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--amber)]">
              <Crown className="h-4 w-4" />
              {t("play.currentGame")}
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">{t("play.saveHint")}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <button
                type="button"
                onClick={handleSaveGame}
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-3 text-sm font-black text-[#211f1b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {t("game.saveSupabase")}
              </button>
              <button
                type="button"
                onClick={handleNewGame}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/7 px-3 text-sm font-black text-white transition hover:bg-white/12"
              >
                <RotateCcw className="h-4 w-4" />
                {t("game.newGame")}
              </button>
            </div>
            <p className="mt-3 rounded-lg border border-white/10 bg-[#171511]/80 p-3 text-xs font-bold leading-5 text-stone-300">{saveMessage}</p>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function getPanelTitle(panel: PlayPanel, t: (key: string, vars?: Record<string, string | number>) => string) {
  if (panel === "online") {
    return t("play.onlineTitle");
  }

  if (panel === "bot") {
    return t("play.botTitle");
  }

  if (panel === "friend") {
    return t("play.friendTitle");
  }

  return t("play.menuTitle");
}

function ModeChoice({ icon: Icon, title, body, onClick }: { icon: LucideIcon; title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-24 grid-cols-[3.5rem_1fr] items-center gap-4 rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] p-4 text-left shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition hover:border-[var(--amber)]/55 hover:bg-white/10"
    >
      <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#171511] text-[var(--amber)]">
        <Icon className="h-7 w-7" />
      </span>
      <span>
        <span className="block text-xl font-black text-white">{title}</span>
        <span className="mt-1 block text-sm font-semibold leading-5 text-stone-300">{body}</span>
      </span>
    </button>
  );
}

function RoomStatusCard({
  room,
  roomMessage,
  playerSeat,
  shareLink,
  getPlayerLabel,
  onCopy,
  t,
}: {
  room: RoomRecord | null;
  roomMessage: string;
  playerSeat: Player | null;
  shareLink: string;
  getPlayerLabel: (player: Player) => string;
  onCopy: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  if (!room) {
    return <p className="rounded-lg border border-white/10 bg-[#171511]/80 p-4 text-sm font-bold leading-6 text-stone-300">{roomMessage}</p>;
  }

  return (
    <div className="rounded-lg border border-[var(--amber)]/25 bg-[var(--amber-soft)] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--amber)]">{t("room.activeRoom")}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-3xl font-black tracking-[0.18em] text-white">{room.code}</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#171511] px-3 text-sm font-black text-white transition hover:bg-black/50"
        >
          <Copy className="h-4 w-4" />
          {t("room.copy")}
        </button>
      </div>
      {shareLink ? <p className="mt-2 truncate text-xs font-semibold text-stone-400">{shareLink}</p> : null}
      <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">
        {t("room.youAre", { player: playerSeat ? getPlayerLabel(playerSeat) : t("room.spectator") })}
      </p>
      <p className="mt-2 rounded-lg border border-white/10 bg-[#171511]/80 p-3 text-xs font-bold leading-5 text-stone-300">{roomMessage}</p>
    </div>
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

function PlayerBar({ slot, timer, isBottom = false }: { slot: PlayerSlotInfo; timer: string; isBottom?: boolean }) {
  const Icon = slot.kind === "bot" ? Bot : slot.kind === "empty" ? UserRound : UserRound;
  const isEmpty = slot.kind === "empty";

  return (
    <div className={`${isBottom ? "mt-3" : "mb-3"} flex min-h-12 items-center justify-between gap-3 rounded-lg bg-[#171511] px-3 py-2`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${isEmpty ? "border border-white/10 bg-white/[0.035] text-transparent" : "bg-white/10 text-[var(--amber)]"}`}>
          {isEmpty ? null : <Icon className="h-5 w-5" />}
        </span>
        <span className="min-w-0">
          <span className={`block truncate text-sm font-black ${isEmpty ? "text-stone-500" : "text-white"}`}>{slot.title}</span>
          <span className="block truncate text-xs font-semibold text-stone-400">{slot.body}</span>
        </span>
      </div>
      <span className="grid min-h-10 min-w-20 place-items-center rounded-md bg-white/7 px-3 text-xl font-black tabular-nums text-stone-300">{timer}</span>
    </div>
  );
}

function buildSlot(
  side: Player,
  mode: GameMode,
  room: RoomRecord | null,
  playerSeat: Player | null,
  botName: string,
  activePanel: PlayPanel,
  matchStarted: boolean,
  t: (key: string, vars?: Record<string, string | number>) => string,
): PlayerSlotInfo {
  if (side === "light") {
    const isYou = mode !== "room" || playerSeat !== "dark";
    return {
      label: t("game.white"),
      title: isYou ? t("match.you") : t("match.friend"),
      body: matchStarted ? (isYou ? t("match.youBody") : t("match.friendBodyShort")) : t("play.waitingStart"),
      kind: isYou ? "you" : "friend",
    };
  }

  if (activePanel === "bot" || mode === "bot") {
    return {
      label: t("game.black"),
      title: botName,
      body: matchStarted ? t("match.botOpponent") : t("play.botSlotPreview"),
      kind: "bot",
    };
  }

  if (mode === "room" && room && (room.status === "active" || room.guest_id)) {
    const isYou = playerSeat === "dark";
    return {
      label: t("game.black"),
      title: isYou ? t("match.you") : t("match.friend"),
      body: isYou ? t("match.youBody") : t("match.friendBodyShort"),
      kind: isYou ? "you" : "friend",
    };
  }

  return {
    label: t("game.black"),
    title: t("play.emptyOpponent"),
    body: t("play.emptyOpponentBody"),
    kind: "empty",
  };
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

function readRoomBoard(room: RoomRecord): Board {
  return Array.isArray(room.board) ? (room.board as unknown as Board) : createInitialBoard();
}

function readRoomTurn(room: RoomRecord): Player {
  return room.current_turn === "dark" ? "dark" : "light";
}

function readRoomHistory(room: RoomRecord): HistoryItem[] {
  if (!Array.isArray(room.moves)) {
    return [];
  }

  return room.moves.filter((item): item is HistoryItem => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return false;
    }

    const candidate = item as Partial<HistoryItem>;
    return Boolean(candidate.move?.notation && (candidate.player === "light" || candidate.player === "dark"));
  });
}

function normalizeRoomCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function readInitialRoomCode() {
  if (typeof window === "undefined") {
    return "";
  }

  return normalizeRoomCode(new URLSearchParams(window.location.search).get("room") ?? "");
}
