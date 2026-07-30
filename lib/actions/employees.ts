"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import {
  inviteEmployeeSchema,
  updateEmployeeSchema,
} from "@/lib/validations";

function generateTempPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");
}

export async function inviteEmployee(input: unknown) {
  const session = await requireAdmin();
  const parsed = inviteEmployeeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false as const, error: { email: ["Сотрудник уже существует"] } };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      role: parsed.data.role as Role,
      password: passwordHash,
      companyId: session.user.companyId,
    },
  });

  await sendMail({
    to: email,
    subject: `Приглашение в кабинет ${session.user.companyName}`,
    text: [
      `Здравствуйте, ${user.name}!`,
      "",
      `Вас пригласили в корпоративный портал «${session.user.companyName}».`,
      `Роль: ${user.role}`,
      `Email: ${user.email}`,
      `Временный пароль: ${tempPassword}`,
      "",
      "Войдите на странице /login и смените пароль при первой возможности.",
    ].join("\n"),
  });

  revalidatePath("/employees");
  return {
    ok: true as const,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tempPassword,
  };
}

export async function updateEmployee(input: unknown) {
  await requireAdmin();
  const parsed = updateEmployeeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Некорректные данные" };
  }

  const session = await requireAdmin();
  const employee = await prisma.user.findFirst({
    where: { id: parsed.data.id, companyId: session.user.companyId },
  });

  if (!employee) {
    return { ok: false as const, error: "Сотрудник не найден" };
  }

  await prisma.user.update({
    where: { id: employee.id },
    data: {
      name: parsed.data.name,
      role: parsed.data.role as Role,
    },
  });

  revalidatePath("/employees");
  return { ok: true as const };
}

export async function deleteEmployee(id: string) {
  const session = await requireAdmin();

  if (id === session.user.id) {
    return { ok: false as const, error: "Нельзя удалить собственную учётную запись" };
  }

  const employee = await prisma.user.findFirst({
    where: { id, companyId: session.user.companyId },
  });

  if (!employee) {
    return { ok: false as const, error: "Сотрудник не найден" };
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/employees");
  return { ok: true as const };
}
