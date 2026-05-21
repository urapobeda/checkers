import { CheckersGame } from "@/components/CheckersGame";
import { AppShell } from "@/components/AppShell";

export default function PlayPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-4 pb-28 md:px-8 lg:py-6 lg:pb-16">
        <CheckersGame />
      </main>
    </AppShell>
  );
}
