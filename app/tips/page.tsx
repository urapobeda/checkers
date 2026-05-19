import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PagePrimitives";
import { ProTipsLibrary } from "@/components/ProTipsLibrary";

export default function TipsPage() {
  return (
    <AppShell>
      <PageHeader
        copyId="page.tips"
      />
      <ProTipsLibrary />
    </AppShell>
  );
}
