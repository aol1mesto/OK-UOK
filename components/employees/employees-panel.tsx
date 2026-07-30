"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  deleteEmployee,
  inviteEmployee,
  updateEmployee,
} from "@/lib/actions/employees";
import {
  inviteEmployeeSchema,
  type InviteEmployeeInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

type Employee = {
  id: string;
  email: string;
  name: string;
  role: "Admin" | "Manager" | "User";
};

export function EmployeesPanel({
  employees,
  currentUserId,
}: {
  employees: Employee[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<InviteEmployeeInput>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "User",
    },
  });

  const onInvite = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await inviteEmployee(values);
      if (!result.ok) {
        toast.error("Не удалось пригласить сотрудника");
        return;
      }
      toast.success(
        `Приглашение отправлено. Временный пароль: ${result.tempPassword}`,
      );
      form.reset();
      setOpen(false);
      router.refresh();
    });
  });

  const onRoleChange = (id: string, role: Employee["role"], name: string) => {
    startTransition(async () => {
      const result = await updateEmployee({ id, role, name });
      if (!result.ok) {
        toast.error(result.error || "Ошибка обновления");
        return;
      }
      toast.success("Роль обновлена");
      router.refresh();
    });
  };

  const onDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteEmployee(id);
      if (!result.ok) {
        toast.error(result.error || "Ошибка удаления");
        return;
      }
      toast.success("Сотрудник удалён");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Сотрудники</h1>
          <p className="text-sm text-muted-foreground">
            Самостоятельная регистрация отключена. Только приглашения Admin.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Пригласить</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Пригласить сотрудника</DialogTitle>
              <DialogDescription>
                Будет создана учётная запись и отправлено письмо с временным
                паролем.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" {...form.register("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
              </div>
              <div className="space-y-2">
                <Label>Роль</Label>
                <Select
                  value={form.watch("role")}
                  onValueChange={(value) =>
                    form.setValue("role", value as InviteEmployeeInput["role"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  {pending ? "Отправка..." : "Создать и отправить"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white/90">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Имя</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Роль</th>
              <th className="px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-t">
                <td className="px-4 py-3">{employee.name}</td>
                <td className="px-4 py-3">{employee.email}</td>
                <td className="px-4 py-3">
                  <Select
                    value={employee.role}
                    onValueChange={(value) =>
                      onRoleChange(
                        employee.id,
                        value as Employee["role"],
                        employee.name,
                      )
                    }
                    disabled={pending}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pending || employee.id === currentUserId}
                    onClick={() => onDelete(employee.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
