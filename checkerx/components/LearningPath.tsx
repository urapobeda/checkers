"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, GraduationCap, Lock, Sparkles } from "lucide-react";
import { completeLesson, isLessonCompleted, loadLessonProgress } from "@/lib/supabase/checkerx-data";
import { lessons } from "@/lib/content";
import { Surface } from "./PagePrimitives";
import type { LessonProgress } from "@/lib/supabase/types";
import { useI18n } from "./LanguageProvider";

export function LearningPath() {
  const { t } = useI18n();
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [selectedSlug, setSelectedSlug] = useState(lessons[0].slug);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [message, setMessage] = useState(t("learn.defaultMessage"));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    loadLessonProgress()
      .then((items) => {
        if (active) {
          setProgress(items);
          if (items.length > 0) {
            setMessage(t("learn.loaded"));
          }
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(error instanceof Error ? error.message : t("learn.loginAvailable"));
        }
      });

    return () => {
      active = false;
    };
  }, [t]);

  const completedCount = useMemo(() => lessons.filter((lesson) => isLessonCompleted(progress, lesson.slug)).length, [progress]);
  const selectedLesson = lessons.find((lesson) => lesson.slug === selectedSlug) ?? lessons[0];
  const selectedAnswerValue = t(`lesson.${selectedLesson.slug}.answer`);
  const answers = useMemo(() => {
    const lessonIndex = lessons.findIndex((lesson) => lesson.slug === selectedLesson.slug);
    const variants = [
      [selectedAnswerValue, t("learn.answer.quiet"), t("learn.answer.wait")],
      [t("learn.answer.quiet"), selectedAnswerValue, t("learn.answer.wait")],
      [t("learn.answer.wait"), t("learn.answer.quiet"), selectedAnswerValue],
    ];
    return variants[Math.max(0, lessonIndex) % variants.length];
  }, [selectedAnswerValue, selectedLesson, t]);

  async function handleComplete() {
    if (selectedAnswer !== selectedAnswerValue) {
      setMessage(t("learn.tryAgain"));
      return;
    }

    setSaving(true);
    setMessage(t("learn.saving"));

    try {
      const result = await completeLesson({
        slug: selectedLesson.slug,
        title: t(`lesson.${selectedLesson.slug}.title`),
        xp: selectedLesson.xp,
      });

      if (!result.ok) {
        setMessage(t("learn.correctLogin"));
        return;
      }

      const nextProgress = await loadLessonProgress();
      setProgress(nextProgress);
      setMessage(result.alreadyCompleted ? t("learn.alreadyDone") : t("learn.completed", { xp: result.xpEarned }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("learn.saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="grid gap-4">
        <Surface>
          <p className="section-label">{t("learn.route")}</p>
          <h2 className="mt-3 text-3xl font-black text-white">{t("learn.completeCount", { done: completedCount, total: lessons.length })}</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">
            {t("learn.body")}
          </p>
          <div className="mt-5">
            <span className="progress-track block">
              <span className="progress-fill block" style={{ width: `${(completedCount / lessons.length) * 100}%` }} />
            </span>
          </div>
        </Surface>

        <Surface>
          <p className="section-label">{t("learn.coachNote")}</p>
          <p className="mt-3 text-lg font-black leading-7 text-white">{t(`lesson.${selectedLesson.slug}.coach`)}</p>
          <p className="mt-4 rounded-lg border border-white/10 bg-[#171511] p-4 text-sm font-semibold leading-6 text-stone-300">{message}</p>
        </Surface>
      </div>

      <div className="grid gap-4">
        {lessons.map((lesson, index) => {
          const completed = isLessonCompleted(progress, lesson.slug);
          const active = selectedSlug === lesson.slug;
          return (
            <Surface key={lesson.slug} className={`grid gap-4 md:grid-cols-[3rem_1fr_9rem] md:items-center ${active ? "border-[var(--amber)]/50" : ""}`}>
              <button
                type="button"
                onClick={() => {
                  setSelectedSlug(lesson.slug);
                  setSelectedAnswer("");
                }}
                className={`grid h-12 w-12 place-items-center rounded-lg ${completed ? "bg-[var(--amber)] text-[#211f1b]" : "bg-[var(--amber-soft)] text-[var(--amber)]"}`}
                aria-label={t(`lesson.${lesson.slug}.title`)}
              >
                {completed ? <Check className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
              </button>
              <span>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--cyan)]">{t("learn.lesson", { number: index + 1, level: t(`lesson.${lesson.slug}.level`) })}</span>
                <span className="mt-2 block text-2xl font-black text-white">{t(`lesson.${lesson.slug}.title`)}</span>
                <span className="mt-2 block text-sm font-semibold leading-6 text-stone-400">{t(`lesson.${lesson.slug}.question`)}</span>
              </span>
              <span className="rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-center text-sm font-black text-white">{completed ? t("learn.done") : `${lesson.xp} XP`}</span>
            </Surface>
          );
        })}

        <Surface className="border-[var(--amber)]/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-label">{t("learn.practiceQuestion")}</p>
              <h2 className="mt-3 text-3xl font-black text-white">{t(`lesson.${selectedLesson.slug}.title`)}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">{t(`lesson.${selectedLesson.slug}.question`)}</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#171511] text-[var(--amber)]">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-5 grid gap-2">
            {answers.map((answer) => (
              <button
                key={answer}
                type="button"
                onClick={() => setSelectedAnswer(answer)}
                className={`min-h-12 rounded-lg border px-4 text-left text-sm font-black transition ${selectedAnswer === answer ? "border-[var(--amber)] bg-[var(--amber-soft)] text-white" : "border-white/10 bg-white/6 text-stone-300 hover:bg-white/10"}`}
              >
                {answer}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleComplete}
            disabled={saving}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,var(--amber),var(--cyan))] px-5 text-sm font-black text-[#211f1b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLessonCompleted(progress, selectedLesson.slug) ? <Lock className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {isLessonCompleted(progress, selectedLesson.slug) ? t("learn.reviewLesson") : t("learn.completeLesson")}
          </button>
        </Surface>
      </div>
    </section>
  );
}
