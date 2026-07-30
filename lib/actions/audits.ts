"use server";

import { AuditStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CHECKLIST_TEMPLATE = [
  "Проверка СИЗ на рабочих местах",
  "Контроль журнала инструктажей",
  "Осмотр эвакуационных путей",
  "Проверка хранения опасных веществ",
  "Аудит документации по охране труда",
];

export async function startAudit() {
  const session = await requireSession();

  const audit = await prisma.audit.create({
    data: {
      companyId: session.user.companyId,
      status: AuditStatus.pending,
      checklistItems: {
        create: CHECKLIST_TEMPLATE.map((text) => ({
          text,
          isCompleted: false,
        })),
      },
    },
    include: {
      _count: { select: { checklistItems: true } },
    },
  });

  // Simulate external webhook: complete audit after short delay
  setTimeout(async () => {
    try {
      const items = await prisma.checklistItem.findMany({
        where: { auditId: audit.id },
      });

      await prisma.$transaction([
        ...items.map((item, index) =>
          prisma.checklistItem.update({
            where: { id: item.id },
            data: {
              isCompleted: index < items.length - 1,
              comment:
                index < items.length - 1
                  ? "Автоматически подтверждено внешней системой"
                  : "Требует повторной проверки",
            },
          }),
        ),
        prisma.audit.update({
          where: { id: audit.id },
          data: { status: AuditStatus.completed },
        }),
      ]);
    } catch (error) {
      console.error("Failed to complete audit simulation", error);
      await prisma.audit.update({
        where: { id: audit.id },
        data: { status: AuditStatus.failed },
      });
    }
  }, 5000);

  revalidatePath("/audits");
  revalidatePath("/dashboard");

  return {
    ok: true as const,
    auditId: audit.id,
    message: "Аудит запущен. Статус обновится через ~5 секунд.",
  };
}
