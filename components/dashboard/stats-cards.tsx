"use client";

import { Activity, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardsProps = {
  totalAudits: number;
  completionRate: number;
  activeViolations: number;
};

export function StatsCards({
  totalAudits,
  completionRate,
  activeViolations,
}: StatsCardsProps) {
  const items = [
    {
      title: "Всего аудитов",
      value: totalAudits,
      icon: Activity,
      hint: "За последние 30 дней",
    },
    {
      title: "Выполнено %",
      value: `${completionRate}%`,
      icon: CheckCircle2,
      hint: "Пунктов чек-листа",
    },
    {
      title: "Активных нарушений",
      value: activeViolations,
      icon: ShieldAlert,
      hint: "Незакрытые пункты",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="animate-fade-up border-border/70 bg-white/90"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight">
                {item.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
