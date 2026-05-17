import { AppShell } from "@/components/AppShell";
import { ElitePanel } from "@/components/ElitePanel";
import { PageHeader } from "@/components/PagePrimitives";

export default function ProPage() {
  return (
    <AppShell>
      <PageHeader
        copyId="page.pro"
      />
      <ElitePanel />
    </AppShell>
  );
}
