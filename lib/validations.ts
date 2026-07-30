import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Укажите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export const inviteEmployeeSchema = z.object({
  email: z.string().email("Укажите корректный email"),
  name: z.string().min(2, "Имя слишком короткое").max(100),
  role: z.enum(["Admin", "Manager", "User"]),
});

export const updateEmployeeSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2).max(100),
  role: z.enum(["Admin", "Manager", "User"]),
});

export const weeklyReportSchema = z.object({
  weekStart: z.string().min(1, "Укажите начало недели"),
  weekEnd: z.string().min(1, "Укажите конец недели"),
  department: z.string().min(1, "Укажите подразделение"),
  inspectionsCount: z.coerce.number().int().min(0),
  violationsFound: z.coerce.number().int().min(0),
  violationsFixed: z.coerce.number().int().min(0),
  trainingCompleted: z.boolean(),
  riskLevel: z.enum(["low", "medium", "high"]),
  summary: z.string().min(10, "Краткий итог — минимум 10 символов"),
  recommendations: z.string().optional(),
  notes: z.string().optional(),
});

export const sendReportEmailSchema = z.object({
  reportId: z.string().cuid(),
  emails: z
    .string()
    .min(3, "Укажите хотя бы один email")
    .transform((value) =>
      value
        .split(/[,;\s]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().email()).min(1)),
});

export const monthlyReportSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020).max(2100),
  department: z.string().min(1),
  auditsCompleted: z.coerce.number().int().min(0),
  openViolations: z.coerce.number().int().min(0),
  compliancePercent: z.coerce.number().min(0).max(100),
  summary: z.string().min(10),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>;
export type WeeklyReportInput = z.infer<typeof weeklyReportSchema>;
