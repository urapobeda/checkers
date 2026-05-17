import { AppShell } from "@/components/AppShell";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { PageHeader } from "@/components/PagePrimitives";

export default function RankingsPage() {
  return (
    <AppShell>
      <PageHeader
        copyId="page.rankings"
      />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 md:px-8 lg:pb-16">
        <LeaderboardTable />
      </main>
    </AppShell>
  );
}
