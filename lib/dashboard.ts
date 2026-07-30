import { AuditStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats(companyId: string) {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const audits = await prisma.audit.findMany({
    where: {
      companyId,
      date: { gte: since },
    },
    include: {
      checklistItems: true,
    },
    orderBy: { date: "asc" },
  });

  const totalAudits = audits.length;
  const allItems = audits.flatMap((audit) => audit.checklistItems);
  const completedItems = allItems.filter((item) => item.isCompleted).length;
  const completionRate =
    allItems.length === 0
      ? 0
      : Math.round((completedItems / allItems.length) * 100);
  const activeViolations = allItems.filter((item) => !item.isCompleted).length;

  const byDayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    byDayMap.set(day.toISOString().slice(0, 10), 0);
  }

  for (const audit of audits) {
    if (audit.status !== AuditStatus.completed) continue;
    const key = new Date(audit.date).toISOString().slice(0, 10);
    if (byDayMap.has(key)) {
      byDayMap.set(key, (byDayMap.get(key) ?? 0) + 1);
    }
  }

  const chartData = Array.from(byDayMap.entries()).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));

  return {
    totalAudits,
    completionRate,
    activeViolations,
    chartData,
  };
}
