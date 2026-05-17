import { AccountPanel } from "@/components/AccountPanel";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PagePrimitives";

export default function AccountPage() {
  return (
    <AppShell>
      <PageHeader
        copyId="page.account"
      />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 md:px-8 lg:pb-16">
        <AccountPanel />
      </main>
    </AppShell>
  );
}
