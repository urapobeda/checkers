import { GraduationCap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Surface } from "@/components/PagePrimitives";
import { lessons } from "@/lib/content";

export default function LearnPage() {
  return (
    <AppShell>
      <PageHeader
        kicker="Learn"
        title="Short checkers lessons with XP."
        body="The learning path will teach captures, chain calculation, king promotion, traps, and endgame technique."
      />
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-28 md:px-8 lg:pb-16">
        {lessons.map((lesson, index) => (
          <Surface key={lesson.title} className="grid gap-4 md:grid-cols-[3rem_1fr_10rem] md:items-center">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--amber-soft)] text-[var(--amber)]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--cyan)]">Lesson {index + 1} / {lesson.level}</span>
              <span className="mt-2 block text-2xl font-black text-white">{lesson.title}</span>
              <span className="mt-3 block">
                <span className="progress-track block"><span className="progress-fill block" style={{ width: `${lesson.progress}%` }} /></span>
              </span>
            </span>
            <span className="rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-center text-sm font-black text-white">{lesson.xp} XP</span>
          </Surface>
        ))}
      </main>
    </AppShell>
  );
}
