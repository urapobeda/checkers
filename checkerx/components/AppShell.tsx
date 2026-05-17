import Link from "next/link";
import { Brain, Crown, GraduationCap, Home, Play, RadioTower, Sparkles, Trophy, Video } from "lucide-react";

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
      <div className="pointer-events-none fixed inset-0 -z-10 board-mesh opacity-45" />
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(7,10,18,0.76)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--cyan)] text-slate-950 shadow-[0_12px_30px_rgba(35,221,255,0.22)]">
              <RadioTower className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-black tracking-tight text-white">CheckerX</span>
              <span className="hidden text-xs font-medium text-slate-400 sm:block">Tactical checkers arena</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/7 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/pro" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--amber)] px-4 text-sm font-bold text-slate-950 transition hover:brightness-110">
              <Crown className="h-4 w-4" />
              Pro
            </Link>
            <Link href="/play" className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex">
              <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
              Start
            </Link>
          </div>
        </div>
      </header>

      {children}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(7,10,18,0.9)] px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.slice(1, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] font-semibold text-slate-300 transition hover:bg-white/8 hover:text-white">
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
