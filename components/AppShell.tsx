"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Brain, Crown, GraduationCap, Home, LogIn, Play, RadioTower, Sparkles, Trophy, UserPlus, UserRound, Video } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadMyProfile } from "@/lib/supabase/checkerx-data";
import { useI18n, type Language } from "./LanguageProvider";

const navItems = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/play", labelKey: "nav.play", icon: Play },
  { href: "/learn", labelKey: "nav.learn", icon: GraduationCap },
  { href: "/coach", labelKey: "nav.coach", icon: Brain },
  { href: "/tips", labelKey: "nav.tips", icon: Video },
  { href: "/rankings", labelKey: "nav.rankings", icon: Trophy },
  { href: "/account", labelKey: "nav.account", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useI18n();
  const pathname = usePathname();
  const [accountLabel, setAccountLabel] = useState(t("shell.signIn"));
  const [signedIn, setSignedIn] = useState(false);
  const isActiveRoute = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    function applyCachedAccount() {
      const cachedLabel = window.localStorage.getItem("checkerx-account-label");
      if (cachedLabel) {
        setSignedIn(true);
        setAccountLabel(cachedLabel);
      } else {
        setSignedIn(false);
        setAccountLabel(t("shell.signIn"));
      }
    }

    applyCachedAccount();

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    let active = true;

    async function syncAccountLabel(user: User | null) {
      if (!active) {
        return;
      }

      if (!user) {
        window.localStorage.removeItem("checkerx-account-label");
        setSignedIn(false);
        setAccountLabel(t("shell.signIn"));
        return;
      }

      setSignedIn(true);
      try {
        const profile = await loadMyProfile();
        if (active) {
          const label = profile?.username || user.email || "Account";
          window.localStorage.setItem("checkerx-account-label", label);
          setAccountLabel(label);
        }
      } catch {
        if (active) {
          const label = user.email || "Account";
          window.localStorage.setItem("checkerx-account-label", label);
          setAccountLabel(label);
        }
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      void syncAccountLabel(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncAccountLabel(session?.user ?? null);
    });

    window.addEventListener("checkerx-account-changed", applyCachedAccount);

    return () => {
      active = false;
      window.removeEventListener("checkerx-account-changed", applyCachedAccount);
      subscription.unsubscribe();
    };
  }, [t]);

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
            <span className="block truncate text-[0.65rem] font-semibold text-stone-400">{t("shell.tagline")}</span>
          </span>
        </Link>

        <nav className="mt-6 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-black transition ${active ? "bg-white/10 text-white shadow-[inset_3px_0_0_var(--amber)]" : "text-stone-300 hover:bg-white/8 hover:text-white"}`}>
                <Icon className={`h-5 w-5 ${active ? "text-[var(--cyan)]" : "text-[var(--amber)]"}`} />
                {t(item.labelKey)}
              </Link>
            );
          })}
          <Link href="/pro" className="mt-2 flex min-h-11 items-center gap-3 rounded-md bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-2 text-sm font-black text-[#211f1b] transition hover:brightness-110">
            <Crown className="h-5 w-5" />
            {t("shell.elite")}
          </Link>
        </nav>

        <div className="mt-auto grid gap-2">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <Link href="/pro" className="flex min-h-10 items-center justify-center gap-2 rounded-md bg-[linear-gradient(180deg,#f1c869,#c58d34)] px-2 text-xs font-black text-[#211f1b]">
            <UserPlus className="h-4 w-4" />
            {t("shell.becomeElite")}
          </Link>
          <Link href="/account" className="flex min-h-10 items-center justify-center gap-2 rounded-md bg-white/8 px-2 text-xs font-black text-white">
            {signedIn ? <UserRound className="h-4 w-4 text-[var(--amber)]" /> : <LogIn className="h-4 w-4 text-[var(--amber)]" />}
            <span className="truncate">{accountLabel}</span>
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
              <span className="hidden text-xs font-medium text-stone-400 sm:block">{t("shell.tagline")}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-300 transition hover:bg-white/7 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/pro" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--amber)] px-4 text-sm font-bold text-[#211f1b] transition hover:brightness-110">
              <Crown className="h-4 w-4" />
              {t("shell.elite")}
            </Link>
            <Link href="/account" className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex">
              <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
              {t("shell.account")}
            </Link>
            <LanguageToggle language={language} setLanguage={setLanguage} compact />
          </div>
        </div>
      </header>

      <div className="lg:pl-44">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(36,35,31,0.92)] px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.slice(1, 6).map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] font-semibold transition ${active ? "bg-[var(--amber-soft)] text-white" : "text-stone-300 hover:bg-white/8 hover:text-white"}`}>
                <Icon className={`h-4 w-4 ${active ? "text-[var(--amber)]" : ""}`} />
                {t(item.labelKey).replace("Pro ", "")}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function LanguageToggle({ language, setLanguage, compact = false }: { language: Language; setLanguage: (language: Language) => void; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-2 rounded-md border border-white/10 bg-black/18 p-1 ${compact ? "w-24" : ""}`}>
      {(["ru", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={`min-h-9 rounded text-xs font-black transition ${language === item ? "bg-[var(--amber)] text-[#211f1b]" : "text-stone-300 hover:bg-white/8"}`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
