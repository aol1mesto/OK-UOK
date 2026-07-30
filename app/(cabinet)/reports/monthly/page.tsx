import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function MonthlyReportPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-3 rounded-lg border bg-white/90 p-6">
      <h1 className="font-display text-3xl">Ежемесячный отчёт</h1>
      <p className="text-sm text-muted-foreground">
        Раздел подготовлен в архитектуре MVP. Полная форма будет подключена во
        второй итерации по той же схеме, что и еженедельный отчёт (`xlsx` +
        email).
      </p>
    </div>
  );
}
