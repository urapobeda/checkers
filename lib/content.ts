import { Brain, Crown, Flame, Focus, Gauge, Medal, MoveDiagonal, RadioTower, ShieldCheck, Sparkles, Trophy, Video } from "lucide-react";

export const quickStats = [
  { label: "Today XP", value: "0 / 80", tone: "cyan" },
  { label: "Current streak", value: "0 days", tone: "amber" },
  { label: "City rank", value: "Unranked", tone: "cyan" },
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
  {
    slug: "forced-captures",
    title: "Forced captures",
    level: "Starter",
    xp: 20,
    progress: 0,
    question: "What should you check before every quiet move?",
    answer: "All available captures",
    coach: "Most beginner losses come from missing mandatory jumps. Scan both diagonals first, then move.",
  },
  {
    slug: "multi-jump-vision",
    title: "Multi-jump vision",
    level: "Tactics",
    xp: 30,
    progress: 0,
    question: "After the first capture, what is the next habit?",
    answer: "Look for another jump from the landing square",
    coach: "A capture is not finished until the piece has no further jump. CheckerX rewards full chains.",
  },
  {
    slug: "race-to-king-row",
    title: "Race to king row",
    level: "Strategy",
    xp: 35,
    progress: 0,
    question: "Why is an open diagonal to the back row dangerous?",
    answer: "It can create a king",
    coach: "When you trade, check whether the opponent gets a clean route to promotion.",
  },
  {
    slug: "king-endgames",
    title: "King endgames",
    level: "Advanced",
    xp: 45,
    progress: 0,
    question: "What makes kings stronger than normal pieces?",
    answer: "They can move and capture backward",
    coach: "Use kings to control long diagonals and force the opponent into bad trades.",
  },
];

export const tips = [
  {
    level: "Beginner",
    title: "See all legal captures first",
    tag: "Rules",
    duration: "6-10 min",
    query: "checkers beginner strategy mandatory captures",
    advice: "Pause before every move and name each jump out loud. This fixes most rule-level mistakes.",
  },
  {
    level: "Club",
    title: "Build double-jump traps",
    tag: "Tactics",
    duration: "8-12 min",
    query: "checkers double jump tactics lesson",
    advice: "Look one landing square ahead. Good traps invite a capture that leaves the next jump open.",
  },
  {
    level: "Advanced",
    title: "Trade into king races",
    tag: "Strategy",
    duration: "10-15 min",
    query: "draughts checkers king race endgame strategy",
    advice: "Do not trade just to simplify. Trade when your remaining piece promotes faster.",
  },
  {
    level: "Pro",
    title: "Calculate forcing chains",
    tag: "Calculation",
    duration: "15+ min",
    query: "checkers advanced tactics forcing moves",
    advice: "Write down candidate captures first, then compare final material and king-row access.",
  },
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
  { icon: Trophy, title: "Elite user badge", body: "Elite user status appears in rankings and the player profile." },
  { icon: Crown, title: "Custom skins", body: "Unlock premium checker pieces and board themes." },
];

export const roadmap = [
  { icon: Flame, title: "Now", body: "Design shell, routes, and product story." },
  { icon: Medal, title: "Next", body: "Checkers engine with forced captures and multi-jumps." },
  { icon: Brain, title: "Then", body: "AI Coach, Pro Tips, Supabase rooms, and Vercel deploy." },
];
