import Link from "next/link";
import { getCompanyInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type LandingHeroProps = {
  companyName: string;
  slogan: string;
  logoUrl?: string | null;
};

export function LandingHero({
  companyName,
  slogan,
  logoUrl,
}: LandingHeroProps) {
  const initials = getCompanyInitials(companyName);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      {/* Full-bleed atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(24,105,128,0.18),transparent_42%),radial-gradient(ellipse_at_85%_80%,rgba(47,138,116,0.16),transparent_45%),linear-gradient(160deg,#e8f1f0_0%,#f3f0e8_42%,#eef4f6_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23186980' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="mb-8 animate-fade-up">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={companyName}
              className="mx-auto h-28 w-28 rounded-full object-cover shadow-lg shadow-[#0f2f38]/20"
            />
          ) : (
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#0f2f38] text-3xl font-semibold tracking-[0.12em] text-white shadow-lg shadow-[#0f2f38]/25">
              {initials || "КП"}
            </div>
          )}
        </div>

        <h1
          className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-[#0f2f38] md:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          {companyName}
        </h1>

        <blockquote
          className="mt-6 max-w-2xl animate-fade-up font-display text-xl leading-relaxed text-[#2a454d] md:text-2xl"
          style={{ animationDelay: "160ms" }}
        >
          «{slogan}»
        </blockquote>

        <div
          className="mt-12 w-full max-w-sm animate-fade-up space-y-3"
          style={{ animationDelay: "260ms" }}
        >
          <Button
            asChild
            size="lg"
            className="w-full bg-[#186980] text-base hover:bg-[#145566]"
          >
            <Link href="/login">Вход для сотрудников</Link>
          </Button>
          <p className="text-xs leading-relaxed text-[#4a5f66]">
            Только для авторизованных сотрудников. Доступ к системе строго
            ограничен
          </p>
        </div>
      </section>
    </main>
  );
}
