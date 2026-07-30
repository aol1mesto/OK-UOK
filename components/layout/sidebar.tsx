"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ClipboardList,
  FileBarChart2,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { cn, getCompanyInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  companyName: string;
  userName: string;
  role: string;
};

const links = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/audits", label: "Аудиты", icon: ClipboardList },
  { href: "/reports/weekly", label: "Отчёт (неделя)", icon: FileBarChart2 },
  { href: "/reports/monthly", label: "Отчёт (месяц)", icon: FileBarChart2 },
];

export function Sidebar({ companyName, userName, role }: SidebarProps) {
  const pathname = usePathname();
  const initials = getCompanyInitials(companyName);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border/80 bg-[#0f2f38] text-white">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f8a74] text-sm font-semibold tracking-wide">
          {initials || "КП"}
        </div>
        <div>
          <p className="font-display text-lg leading-tight">{companyName}</p>
          <p className="text-xs text-white/60">Корпоративный портал</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
        {role === "Admin" && (
          <Link
            href="/employees"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              pathname.startsWith("/employees")
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
          >
            <Users className="h-4 w-4" />
            Сотрудники
          </Link>
        )}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-sm font-medium">{userName}</p>
        <p className="mb-3 text-xs text-white/55">{role}</p>
        <Button
          variant="secondary"
          className="w-full justify-start bg-white/10 text-white hover:bg-white/20"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  );
}
