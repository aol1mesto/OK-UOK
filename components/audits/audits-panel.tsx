"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { startAudit } from "@/lib/actions/audits";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AuditRow = {
  id: string;
  date: string;
  status: string;
  itemsCount: number;
  completedCount: number;
};

const statusLabels: Record<string, string> = {
  pending: "В процессе",
  completed: "Завершён",
  failed: "Ошибка",
};

export function AuditsPanel({ audits }: { audits: AuditRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(audits);

  const onStart = () => {
    startTransition(async () => {
      const result = await startAudit();
      if (!result.ok) {
        toast.error("Не удалось запустить аудит");
        return;
      }

      toast.success(result.message);
      setRows((prev) => [
        {
          id: result.auditId,
          date: new Date().toISOString(),
          status: "pending",
          itemsCount: 5,
          completedCount: 0,
        },
        ...prev,
      ]);

      setTimeout(() => {
        router.refresh();
      }, 5500);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Аудиты</h1>
          <p className="text-sm text-muted-foreground">
            Список проверок и имитация webhook от внешней системы
          </p>
        </div>
        <Button onClick={onStart} disabled={pending}>
          {pending ? "Запуск..." : "Запустить новый аудит"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white/90">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Пунктов</th>
              <th className="px-4 py-3 font-medium">Выполнено</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((audit) => (
              <tr key={audit.id} className="border-t">
                <td className="px-4 py-3">{formatDate(audit.date)}</td>
                <td className="px-4 py-3">
                  {statusLabels[audit.status] ?? audit.status}
                </td>
                <td className="px-4 py-3">{audit.itemsCount}</td>
                <td className="px-4 py-3">{audit.completedCount}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Аудитов пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
