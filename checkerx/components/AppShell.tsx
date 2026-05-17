import Link from "next/link";
import { Brain, Crown, GraduationCap, Home, LogIn, Play, RadioTower, Search, Sparkles, Trophy, UserPlus, Video } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/play", label: "Play", icon: Play },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/coach", label: "Coach", icon: Brain },
  { href: "/tips", label: "Pro Tips", icon: Video },
  { href: "/rankings", label: "Rankings", icon: Trophy },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 -z-10 board-mesh opacity-80" />

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-44 flex-col border-r border-black/25 bg-[var(--sidebar)] px-2 py-4 shadow-[14px_0_42px_rgba(0,0,0,0.2)] lg:flex">
        <Link href="/" className="flex items-center gap-2 px-1">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--amber)] text-[#211f1b] shadow-[0_8px_20px_rgba(215,164,73,0.25)]">
            <RadioTower className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black leading-5 text-white">CheckerX</span>
            <span className="block truncate text-[0.65rem] font-semibold text-stone-400">checkers arena</span>
          </span>
        </Link>

        <nav className="mt-6 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-black text-stone-300 transition hover:bg-white/8 hover:text-white">
                <Icon className="h-5 w-5 text-[var(--amber)]" />
                {item.label}
              </Link>
            );
          })}
          <Link href="/pro" className="mt-2 flex min-h-11 items-center gap-3 rounded-md bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-2 text-sm font-black text-[#211f1b] transition hover:brightness-110">
            <Crown className="h-5 w-5" />
            Elite user
          </Link>
        </nav>

        <div className="mt-auto grid gap-2">
          <Link href="/play" className="flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-black/18 px-2 text-xs font-bold text-stone-300">
            <Search className="h-4 w-4 text-stone-400" />
            Search
          </Link>
          <Link href="/pro" className="flex min-h-10 items-center justify-center gap-2 rounded-md bg-[linear-gradient(180deg,#f1c869,#c58d34)] px-2 text-xs font-black text-[#211f1b]">
            <UserPlus className="h-4 w-4" />
            Become Elite
          </Link>
          <Link href="/play" className="flex min-h-10 items-center justify-center gap-2 rounded-md bg-white/8 px-2 text-xs font-black text-white">
            <LogIn className="h-4 w-4 text-[var(--amber)]" />
            Sign in
          </Link>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(36,35,31,0.82)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--amber)] text-[#211f1b] shadow-[0_12px_30px_rgba(215,164,73,0.22)]">
              <RadioTower className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-black tracking-tight text-white">CheckerX</span>
              <span className="hidden text-xs font-medium text-stone-400 sm:block">Tactical checkers arena</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-300 transition hover:bg-white/7 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/pro" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--amber)] px-4 text-sm font-bold text-[#211f1b] transition hover:brightness-110">
              <Crown className="h-4 w-4" />
              Elite
            </Link>
            <Link href="/play" className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex">
              <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
              Start
            </Link>
          </div>
        </div>
      </header>

      <div className="lg:pl-44">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(36,35,31,0.92)] px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.slice(1, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] font-semibold text-stone-300 transition hover:bg-white/8 hover:text-white">
                <Icon className="h-4 w-4" />
                {item.label.replace("Pro Tips", "Tips")}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
