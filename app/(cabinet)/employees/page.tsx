import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { EmployeesPanel } from "@/components/employees/employees-panel";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EmployeesPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== Role.Admin) {
    redirect("/dashboard");
  }

  const employees = await prisma.user.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return (
    <EmployeesPanel
      employees={employees}
      currentUserId={session.user.id}
    />
  );
}
