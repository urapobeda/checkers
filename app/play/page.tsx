import { CheckersGame } from "@/components/CheckersGame";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PagePrimitives";

export default function PlayPage() {
  return (
    <AppShell>
      <PageHeader
        copyId="page.play"
      />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 md:px-8 lg:pb-16">
        <CheckersGame />
      </main>
    </AppShell>
  );
}
