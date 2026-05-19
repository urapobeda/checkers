export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Profile = {
  id: string;
  email: string | null;
  username: string;
  city: string;
  skill_level: string;
  avatar_initials: string;
  today_xp: number;
  total_xp: number;
  rating: number;
  coach_score: number;
  current_streak: number;
  elite_user: boolean;
  last_active_on: string | null;
  created_at: string;
  updated_at: string;
};

export type GameRecord = {
  id: string;
  user_id: string | null;
  mode: string;
  bot_level: string | null;
  player_color: string;
  winner: string | null;
  move_count: number;
  moves: Json;
  final_board: Json;
  accuracy: number | null;
  coach_summary: string | null;
  missed_captures: number;
  xp_earned: number;
  rating_delta: number;
  created_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_slug: string;
  lesson_title: string;
  completed: boolean;
  xp_earned: number;
  completed_at: string | null;
  updated_at: string;
};

export type RoomRecord = {
  id: string;
  code: string;
  host_id: string | null;
  guest_id: string | null;
  status: string;
  current_turn: string;
  board: Json;
  moves: Json;
  time_control: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email?: string | null;
          username?: string;
          city?: string;
          skill_level?: string;
          avatar_initials?: string;
          today_xp?: number;
          total_xp?: number;
          rating?: number;
          coach_score?: number;
          current_streak?: number;
          elite_user?: boolean;
          last_active_on?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      games: {
        Row: GameRecord;
        Insert: {
          id?: string;
          user_id?: string | null;
          mode?: string;
          bot_level?: string | null;
          player_color?: string;
          winner?: string | null;
          move_count?: number;
          moves?: Json;
          final_board?: Json;
          accuracy?: number | null;
          coach_summary?: string | null;
          missed_captures?: number;
          xp_earned?: number;
          rating_delta?: number;
          created_at?: string;
        };
        Update: Partial<GameRecord>;
        Relationships: [];
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: {
          id?: string;
          user_id: string;
          lesson_slug: string;
          lesson_title: string;
          completed?: boolean;
          xp_earned?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<LessonProgress>;
        Relationships: [];
      };
      rooms: {
        Row: RoomRecord;
        Insert: {
          id?: string;
          code: string;
          host_id?: string | null;
          guest_id?: string | null;
          status?: string;
          current_turn?: string;
          board?: Json;
          moves?: Json;
          time_control?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<RoomRecord>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
