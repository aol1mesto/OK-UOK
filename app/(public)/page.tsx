import { LandingHero } from "@/components/public/landing-hero";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const company = await prisma.company.findFirst({
    orderBy: { createdAt: "asc" },
  });

  return (
    <LandingHero
      companyName={company?.name ?? "Корпоративный портал"}
      slogan={
        company?.slogan ??
        "Качество — это не контроль на выходе, а культура на каждом участке."
      }
      logoUrl={company?.logo}
    />
  );
}
