"use client";

import { getSupabaseBrowserClient } from "./client";
import type { GameRecord, Json, LessonProgress, Profile } from "./types";

export type MovePayload = {
  notation: string;
  player: string;
  source: string;
  captures: number;
};

export type SaveGameInput = {
  mode: string;
  botLevel?: string | null;
  winner?: string | null;
  moves: MovePayload[];
  finalBoard: Json;
};

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function loadMyProfile() {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return null;
  }

  await ensureProfile();

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) {
    throw error;
  }

  return data;
}

export async function ensureProfile() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return null;
  }

  const { data: existingProfile, error: existingError } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (existingError) {
    throw existingError;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const username = typeof user.user_metadata.username === "string" ? user.user_metadata.username : "CheckerX Player";
  const city = typeof user.user_metadata.city === "string" ? user.user_metadata.city : "Almaty";
  const skillLevel = typeof user.user_metadata.skill_level === "string" ? user.user_metadata.skill_level : "beginner";
  const initials = makeInitials(username);

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email ?? null,
      username,
      city,
      skill_level: skillLevel,
      avatar_initials: initials,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return profile;
}

export async function updateMyProfile(input: Pick<Profile, "username" | "city" | "skill_level">) {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    throw new Error("Sign in before updating profile.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      username: input.username,
      city: input.city,
      skill_level: input.skill_level,
      avatar_initials: makeInitials(input.username),
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function loadRecentGames(limit = 8) {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return [];
  }

  const { data, error } = await supabase.from("games").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(limit);
  if (error) {
    throw error;
  }

  return data;
}

export async function loadLatestGame() {
  const games = await loadRecentGames(1);
  return games[0] ?? null;
}

export async function loadLessonProgress() {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return [];
  }

  const { data, error } = await supabase.from("lesson_progress").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
  if (error) {
    throw error;
  }

  return data;
}

export async function completeLesson(input: { slug: string; title: string; xp: number }) {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return { ok: false as const, reason: "auth" as const };
  }

  const profile = await ensureProfile();
  const { data: existing, error: existingError } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_slug", input.slug)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  const alreadyCompleted = Boolean(existing?.completed);
  const { error: upsertError } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_slug: input.slug,
      lesson_title: input.title,
      completed: true,
      xp_earned: input.xp,
      completed_at: existing?.completed_at ?? new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_slug" },
  );

  if (upsertError) {
    throw upsertError;
  }

  if (!alreadyCompleted) {
    const nextTodayXp = (profile?.today_xp ?? 0) + input.xp;
    const nextTotalXp = (profile?.total_xp ?? 0) + input.xp;
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        today_xp: nextTodayXp,
        total_xp: nextTotalXp,
        current_streak: Math.max(1, profile?.current_streak ?? 0),
        last_active_on: new Date().toISOString().slice(0, 10),
      })
      .eq("id", user.id);

    if (profileError) {
      throw profileError;
    }
  }

  return { ok: true as const, xpEarned: alreadyCompleted ? 0 : input.xp, alreadyCompleted };
}

export async function activateEliteDemo() {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return { ok: false as const, reason: "auth" as const };
  }

  await ensureProfile();
  const { data, error } = await supabase.from("profiles").update({ elite_user: true }).eq("id", user.id).select("*").single();
  if (error) {
    throw error;
  }

  return { ok: true as const, profile: data };
}

export async function loadLeaderboard(city?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return [];
  }

  let query = supabase.from("profiles").select("*").order("rating", { ascending: false }).limit(20);
  if (city) {
    query = query.eq("city", city);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data;
}

export async function saveGameResult(input: SaveGameInput) {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return { ok: false as const, reason: "auth" as const };
  }

  const profile = await ensureProfile();
  const winner = input.winner ?? null;
  const didWin = winner === "light";
  const didLose = winner === "dark";
  const xpEarned = Math.max(8, input.moves.length * 2 + (didWin ? 24 : didLose ? 10 : 14));
  const ratingDelta = didWin ? 14 : didLose ? -8 : input.moves.length >= 6 ? 4 : 0;
  const missedCaptures = Math.max(0, input.moves.filter((move) => move.captures === 0).length - 4);
  const accuracy = Math.max(45, Math.min(96, 84 + input.moves.filter((move) => move.captures > 0).length * 3 - missedCaptures * 4));
  const coachSummary =
    winner === "light"
      ? "You converted the position and kept enough material to win."
      : winner === "dark"
        ? "The bot found stronger forcing lines. Review the move log for missed capture chances."
        : "Training save captured the current position for later review.";

  const { error: insertError } = await supabase.from("games").insert({
    user_id: user.id,
    mode: input.mode,
    bot_level: input.botLevel ?? null,
    player_color: "light",
    winner,
    move_count: input.moves.length,
    moves: input.moves as unknown as Json,
    final_board: input.finalBoard,
    accuracy,
    coach_summary: coachSummary,
    missed_captures: missedCaptures,
    xp_earned: xpEarned,
    rating_delta: ratingDelta,
  });

  if (insertError) {
    throw insertError;
  }

  const currentRating = profile?.rating ?? 1200;
  const todayXp = profile?.today_xp ?? 0;
  const totalXp = profile?.total_xp ?? 0;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      today_xp: todayXp + xpEarned,
      total_xp: totalXp + xpEarned,
      rating: Math.max(100, currentRating + ratingDelta),
      coach_score: accuracy,
      current_streak: Math.max(1, profile?.current_streak ?? 0),
      last_active_on: new Date().toISOString().slice(0, 10),
    })
    .eq("id", user.id);

  if (updateError) {
    throw updateError;
  }

  return { ok: true as const, xpEarned, ratingDelta };
}

export function serializeGameRecord(record: GameRecord) {
  return {
    ...record,
    createdLabel: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(record.created_at)),
  };
}

export function isLessonCompleted(progress: LessonProgress[], slug: string) {
  return progress.some((item) => item.lesson_slug === slug && item.completed);
}

function makeInitials(username: string) {
  const parts = username.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : username.slice(0, 2);
  return initials.toUpperCase() || "CX";
}
