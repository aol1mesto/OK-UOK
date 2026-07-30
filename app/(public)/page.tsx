import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCompanyInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const company = await prisma.company.findFirst({
    orderBy: { createdAt: "asc" },
  });

  const name = company?.name ?? "Корпоративный портал";
  const slogan =
    company?.slogan ??
    "Качество — это не контроль на выходе, а культура на каждом участке.";
  const initials = getCompanyInitials(name);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#186980]/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#2f8a74]/15 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center animate-fade-up">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#0f2f38] text-2xl font-semibold tracking-[0.08em] text-white shadow-lg shadow-[#0f2f38]/20">
          {initials || "КП"}
        </div>

        <p className="mb-3 font-display text-sm uppercase tracking-[0.28em] text-[#186980]">
          {name}
        </p>

        <blockquote className="font-display text-3xl leading-snug text-[#13262c] md:text-4xl">
          «{slogan}»
        </blockquote>

        <div className="mt-10 w-full max-w-sm space-y-3">
          <Button asChild size="lg" className="w-full text-base">
            <Link href="/login">Вход для сотрудников</Link>
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Только для авторизованных сотрудников. Доступ к системе строго
            ограничен
          </p>
        </div>
      </section>
    </main>
  );
}
