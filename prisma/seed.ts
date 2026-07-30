import { PrismaClient, Role, AuditStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.checklistItem.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.weeklyReport.deleteMany();
  await prisma.monthlyReport.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const company = await prisma.company.create({
    data: {
      name: "ОК-УОК",
      slogan:
        "Качество — это не контроль на выходе, а культура на каждом участке.",
      logo: null,
    },
  });

  const password = await hash("Admin123!", 10);
  const managerPassword = await hash("Manager123!", 10);
  const userPassword = await hash("User123!", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@ok-uok.local",
        name: "Администратор Портала",
        password,
        role: Role.Admin,
        companyId: company.id,
      },
      {
        email: "manager@ok-uok.local",
        name: "Ирина Менеджерова",
        password: managerPassword,
        role: Role.Manager,
        companyId: company.id,
      },
      {
        email: "user@ok-uok.local",
        name: "Павел Наблюдатель",
        password: userPassword,
        role: Role.User,
        companyId: company.id,
      },
    ],
  });

  const now = new Date();
  const auditsData = Array.from({ length: 12 }).map((_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - index * 2);
    const completed = index % 5 !== 0;
    return {
      companyId: company.id,
      date,
      status: completed ? AuditStatus.completed : AuditStatus.pending,
      items: [
        "Проверка СИЗ на рабочих местах",
        "Контроль журнала инструктажей",
        "Осмотр эвакуационных путей",
        "Проверка хранения опасных веществ",
        "Аудит документации по охране труда",
      ],
      completedCount: completed ? 3 + (index % 3) : 1,
    };
  });

  for (const audit of auditsData) {
    await prisma.audit.create({
      data: {
        companyId: audit.companyId,
        date: audit.date,
        status: audit.status,
        checklistItems: {
          create: audit.items.map((text, i) => ({
            text,
            isCompleted: i < audit.completedCount,
            comment: i < audit.completedCount ? "Пункт выполнен" : null,
          })),
        },
      },
    });
  }

  console.log("Seed completed.");
  console.log("Company:", company.name);
  console.log("Admin: admin@ok-uok.local / Admin123!");
  console.log("Manager: manager@ok-uok.local / Manager123!");
  console.log("User: user@ok-uok.local / User123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
