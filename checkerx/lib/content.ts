import { Brain, Crown, Flame, Focus, Gauge, Medal, MoveDiagonal, RadioTower, ShieldCheck, Sparkles, Trophy, Video } from "lucide-react";

export const quickStats = [
  { label: "Today XP", value: "40 / 80", tone: "cyan" },
  { label: "Current streak", value: "1 day", tone: "amber" },
  { label: "City rank", value: "#12 Almaty", tone: "cyan" },
];

export const productLoops = [
  {
    icon: MoveDiagonal,
    title: "Mandatory Capture Scan",
    body: "CheckerX trains the habit that decides most games: find every forced capture before touching a piece.",
  },
  {
    icon: Brain,
    title: "AI Coach Review",
    body: "After a match, the coach explains missed jumps, weak trades, and open paths to kings.",
  },
  {
    icon: Video,
    title: "Pro Tips Library",
    body: "Curated YouTube lessons by level: beginner basics, tactical chains, king endgames, and pro calculation.",
  },
];

export const playModes = [
  { icon: RadioTower, title: "Friend Room", body: "Create a link, invite a rival, and play a timed match.", action: "Create room" },
  { icon: Sparkles, title: "Training Bot", body: "Practice against Beginner, Club, or Pro-style bot profiles.", action: "Train now" },
  { icon: ShieldCheck, title: "Same Device", body: "Play both sides locally and turn the game into a review.", action: "Local board" },
];

export const lessons = [
  { title: "Forced captures", level: "Starter", xp: 20, progress: 80 },
  { title: "Multi-jump vision", level: "Tactics", xp: 30, progress: 45 },
  { title: "Race to king row", level: "Strategy", xp: 35, progress: 20 },
  { title: "King endgames", level: "Advanced", xp: 45, progress: 0 },
];

export const tips = [
  { level: "Beginner", title: "See all legal captures first", tag: "Rules", duration: "6 min" },
  { level: "Club", title: "Build double-jump traps", tag: "Tactics", duration: "9 min" },
  { level: "Advanced", title: "Trade into king races", tag: "Strategy", duration: "12 min" },
  { level: "Pro", title: "Calculate forcing chains", tag: "Calculation", duration: "15 min" },
];

export const leaderboard = [
  { name: "Aruzhan S.", city: "Almaty", rating: 1840, coach: 92, badge: "Chain Master" },
  { name: "Dana K.", city: "Astana", rating: 1765, coach: 88, badge: "No Missed Jumps" },
  { name: "Miras A.", city: "Shymkent", rating: 1688, coach: 83, badge: "King Runner" },
  { name: "Guest Player", city: "Almaty", rating: 1200, coach: 50, badge: "New" },
];

export const proBenefits = [
  { icon: Gauge, title: "Deep review", body: "Longer coach explanations and move-by-move risk labels." },
  { icon: Focus, title: "Mistake drills", body: "Every missed capture becomes a repeatable puzzle card." },
  { icon: Trophy, title: "City badge", body: "Founder Pro badge appears in rankings and player profile." },
  { icon: Crown, title: "Custom skins", body: "Unlock premium checker pieces and board themes." },
];

export const roadmap = [
  { icon: Flame, title: "Now", body: "Design shell, routes, and product story." },
  { icon: Medal, title: "Next", body: "Checkers engine with forced captures and multi-jumps." },
  { icon: Brain, title: "Then", body: "AI Coach, Pro Tips, Supabase rooms, and Vercel deploy." },
];
