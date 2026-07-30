import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getSession } from "@/lib/auth";

export default async function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar
          companyName={session.user.companyName}
          userName={session.user.name ?? session.user.email ?? "Сотрудник"}
          role={session.user.role}
        />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white/70 px-4 py-3 md:hidden">
          <div>
            <p className="font-display text-lg">{session.user.companyName}</p>
            <p className="text-xs text-muted-foreground">{session.user.role}</p>
          </div>
        </header>
        <main className="cabinet-surface flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
