import { AppShell } from "@/components/AppShell";
import { LearningPath } from "@/components/LearningPath";
import { PageHeader } from "@/components/PagePrimitives";

export default function LearnPage() {
  return (
    <AppShell>
      <PageHeader
        copyId="page.learn"
      />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 md:px-8 lg:pb-16">
        <LearningPath />
      </main>
    </AppShell>
  );
}
