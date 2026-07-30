import { redirect } from "next/navigation";
import { AuditsChart } from "@/components/dashboard/audits-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const stats = await getDashboardStats(session.user.companyId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Дашборд</h1>
        <p className="text-sm text-muted-foreground">
          Сводка по аудитам и нарушениям компании «{session.user.companyName}»
        </p>
      </div>
      <StatsCards
        totalAudits={stats.totalAudits}
        completionRate={stats.completionRate}
        activeViolations={stats.activeViolations}
      />
      <AuditsChart data={stats.chartData} />
    </div>
  );
}
