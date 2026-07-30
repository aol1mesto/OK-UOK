"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createWeeklyReport,
  exportWeeklyReportExcel,
  sendWeeklyReportEmail,
} from "@/lib/actions/reports";
import {
  weeklyReportSchema,
  type WeeklyReportInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function WeeklyReportForm() {
  const [pending, startTransition] = useTransition();
  const [reportId, setReportId] = useState<string | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emails, setEmails] = useState("test@example.com");

  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  const form = useForm<WeeklyReportInput>({
    resolver: zodResolver(weeklyReportSchema),
    defaultValues: {
      weekStart: toInputDate(weekAgo),
      weekEnd: toInputDate(today),
      department: "Служба контроля качества",
      inspectionsCount: 5,
      violationsFound: 2,
      violationsFixed: 1,
      trainingCompleted: true,
      riskLevel: "medium",
      summary: "Неделя прошла в штатном режиме, требуется контроль зоны склада.",
      recommendations: "Повторить инструктаж по СИЗ.",
      notes: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createWeeklyReport(values);
      if (!result.ok) {
        toast.error("Проверьте форму отчёта");
        return;
      }
      setReportId(result.reportId);
      toast.success("Отчёт сохранён");
    });
  });

  const onExport = () => {
    if (!reportId) {
      toast.error("Сначала сохраните отчёт");
      return;
    }
    startTransition(async () => {
      const result = await exportWeeklyReportExcel(reportId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const binary = atob(result.base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Excel скачан");
    });
  };

  const onSend = () => {
    if (!reportId) {
      toast.error("Сначала сохраните отчёт");
      return;
    }
    startTransition(async () => {
      const result = await sendWeeklyReportEmail({
        reportId,
        emails,
      });
      if (!result.ok) {
        toast.error(result.error || "Не удалось отправить");
        return;
      }
      toast.success("Отчёт отправлен на почту");
      setEmailOpen(false);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Еженедельный отчёт</h1>
        <p className="text-sm text-muted-foreground">
          Заполните форму, сформируйте Excel и отправьте на указанные адреса
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-lg border bg-white/90 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weekStart">Начало недели</Label>
            <Input id="weekStart" type="date" {...form.register("weekStart")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekEnd">Конец недели</Label>
            <Input id="weekEnd" type="date" {...form.register("weekEnd")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Подразделение</Label>
          <Input id="department" {...form.register("department")} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="inspectionsCount">Проверок проведено</Label>
            <Input
              id="inspectionsCount"
              type="number"
              {...form.register("inspectionsCount")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="violationsFound">Нарушений выявлено</Label>
            <Input
              id="violationsFound"
              type="number"
              {...form.register("violationsFound")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="violationsFixed">Нарушений устранено</Label>
            <Input
              id="violationsFixed"
              type="number"
              {...form.register("violationsFixed")}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Уровень риска</Label>
            <Controller
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-end gap-3 pb-2">
            <Controller
              control={form.control}
              name="trainingCompleted"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                  id="trainingCompleted"
                />
              )}
            />
            <Label htmlFor="trainingCompleted">Обучение проведено</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Итог недели</Label>
          <Textarea id="summary" {...form.register("summary")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recommendations">Рекомендации</Label>
          <Textarea id="recommendations" {...form.register("recommendations")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Примечания</Label>
          <Textarea id="notes" {...form.register("notes")} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            Сохранить отчёт
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending || !reportId}
            onClick={onExport}
          >
            Сформировать Excel
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending || !reportId}
            onClick={() => setEmailOpen(true)}
          >
            Отправить по почте
          </Button>
        </div>
        {reportId && (
          <p className="text-xs text-muted-foreground">
            ID отчёта: {reportId}
          </p>
        )}
      </form>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправка отчёта</DialogTitle>
            <DialogDescription>
              Укажите один или несколько email через запятую
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="emails">Email</Label>
            <Input
              id="emails"
              value={emails}
              onChange={(event) => setEmails(event.target.value)}
              placeholder="test@example.com, safety@company.ru"
            />
          </div>
          <DialogFooter>
            <Button onClick={onSend} disabled={pending}>
              {pending ? "Отправка..." : "Отправить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
