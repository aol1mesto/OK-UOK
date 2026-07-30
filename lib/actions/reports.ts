"use server";

import { ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { canManageReports, requireSession } from "@/lib/auth";
import { buildWorkbookBuffer, weeklyReportToRows } from "@/lib/excel";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import {
  sendReportEmailSchema,
  weeklyReportSchema,
} from "@/lib/validations";

export async function createWeeklyReport(input: unknown) {
  const session = await requireSession();
  if (!canManageReports(session.user.role)) {
    return { ok: false as const, error: "Недостаточно прав" };
  }

  const parsed = weeklyReportSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const report = await prisma.weeklyReport.create({
    data: {
      companyId: session.user.companyId,
      weekStart: new Date(parsed.data.weekStart),
      weekEnd: new Date(parsed.data.weekEnd),
      data: parsed.data,
      createdBy: session.user.id,
      status: ReportStatus.submitted,
    },
  });

  revalidatePath("/reports/weekly");
  return { ok: true as const, reportId: report.id };
}

export async function exportWeeklyReportExcel(reportId: string) {
  const session = await requireSession();
  const report = await prisma.weeklyReport.findFirst({
    where: { id: reportId, companyId: session.user.companyId },
  });

  if (!report) {
    return { ok: false as const, error: "Отчёт не найден" };
  }

  const data = report.data as Record<string, unknown>;
  const rows = weeklyReportToRows({
    weekStart: String(data.weekStart ?? report.weekStart.toISOString()),
    weekEnd: String(data.weekEnd ?? report.weekEnd.toISOString()),
    department: String(data.department ?? ""),
    inspectionsCount: Number(data.inspectionsCount ?? 0),
    violationsFound: Number(data.violationsFound ?? 0),
    violationsFixed: Number(data.violationsFixed ?? 0),
    trainingCompleted: Boolean(data.trainingCompleted),
    riskLevel: String(data.riskLevel ?? ""),
    summary: String(data.summary ?? ""),
    recommendations: data.recommendations
      ? String(data.recommendations)
      : undefined,
    notes: data.notes ? String(data.notes) : undefined,
  });

  const buffer = buildWorkbookBuffer("Еженедельный отчёт", rows);
  return {
    ok: true as const,
    filename: `weekly-report-${report.id}.xlsx`,
    base64: buffer.toString("base64"),
  };
}

export async function sendWeeklyReportEmail(input: unknown) {
  const session = await requireSession();
  if (!canManageReports(session.user.role)) {
    return { ok: false as const, error: "Недостаточно прав" };
  }

  const parsed = sendReportEmailSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Проверьте список email" };
  }

  const report = await prisma.weeklyReport.findFirst({
    where: {
      id: parsed.data.reportId,
      companyId: session.user.companyId,
    },
  });

  if (!report) {
    return { ok: false as const, error: "Отчёт не найден" };
  }

  const exported = await exportWeeklyReportExcel(report.id);
  if (!exported.ok) {
    return exported;
  }

  await sendMail({
    to: parsed.data.emails,
    subject: `Еженедельный отчёт — ${session.user.companyName}`,
    text: `Во вложении еженедельный отчёт компании «${session.user.companyName}».`,
    attachments: [
      {
        filename: exported.filename,
        content: Buffer.from(exported.base64, "base64"),
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });

  await prisma.weeklyReport.update({
    where: { id: report.id },
    data: { status: ReportStatus.sent },
  });

  revalidatePath("/reports/weekly");
  return { ok: true as const };
}
