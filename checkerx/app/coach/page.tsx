import { AppShell } from "@/components/AppShell";
import { CoachReview } from "@/components/CoachReview";
import { PageHeader } from "@/components/PagePrimitives";

export default function CoachPage() {
  return (
    <AppShell>
      <PageHeader
        copyId="page.coach"
      />
      <CoachReview />
    </AppShell>
  );
}
