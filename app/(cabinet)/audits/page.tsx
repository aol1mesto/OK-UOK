import { redirect } from "next/navigation";
import { AuditsPanel } from "@/components/audits/audits-panel";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AuditsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const audits = await prisma.audit.findMany({
    where: { companyId: session.user.companyId },
    include: {
      checklistItems: true,
    },
    orderBy: { date: "desc" },
  });

  return (
    <AuditsPanel
      audits={audits.map((audit) => ({
        id: audit.id,
        date: audit.date.toISOString(),
        status: audit.status,
        itemsCount: audit.checklistItems.length,
        completedCount: audit.checklistItems.filter((item) => item.isCompleted)
          .length,
      }))}
    />
  );
}
