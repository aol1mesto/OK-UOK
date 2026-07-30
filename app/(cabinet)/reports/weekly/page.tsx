import { redirect } from "next/navigation";
import { WeeklyReportForm } from "@/components/reports/weekly-report-form";
import { canManageReports, getSession } from "@/lib/auth";

export default async function WeeklyReportPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageReports(session.user.role)) {
    return (
      <div className="rounded-lg border bg-white/90 p-6">
        <h1 className="font-display text-3xl">Еженедельный отчёт</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Роль User имеет доступ только на чтение. Заполнение отчётов доступно
          Admin и Manager.
        </p>
      </div>
    );
  }

  return <WeeklyReportForm />;
}
