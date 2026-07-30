import Image from "next/image";
import Link from "next/link";
import { getCompanyInitials } from "@/lib/utils";

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="absolute inset-0">
        <Image
          src="/hero-facility.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-[hero-zoom_18s_ease-out_both]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,28,34,0.72)_0%,rgba(10,36,42,0.78)_45%,rgba(8,24,30,0.88)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(88,196,170,0.35), transparent 34%), radial-gradient(circle at 80% 70%, rgba(56,148,168,0.28), transparent 40%)",
          }}
        />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center text-white">
        <div className="mb-8 animate-fade-up">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={companyName}
              className="mx-auto h-28 w-28 rounded-full object-cover ring-2 ring-white/40"
            />
          ) : (
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold tracking-[0.14em] text-white ring-2 ring-white/35 backdrop-blur-sm">
              {initials || "КП"}
            </div>
          )}
        </div>

        <h1
          className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-white drop-shadow-sm md:text-6xl"
          style={{ animationDelay: "90ms" }}
        >
          {companyName}
        </h1>

        <blockquote
          className="mt-6 max-w-2xl animate-fade-up font-display text-xl leading-relaxed text-white/90 md:text-2xl"
          style={{ animationDelay: "180ms" }}
        >
          «{slogan}»
        </blockquote>

        <div
          className="mt-12 w-full max-w-sm animate-fade-up space-y-3"
          style={{ animationDelay: "280ms" }}
        >
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#3db89a] px-8 text-base font-semibold text-[#062228] transition-colors duration-300 hover:bg-[#56c9ad]"
          >
            Вход для сотрудников
          </Link>
          <p className="text-xs leading-relaxed text-white/65">
            Только для авторизованных сотрудников. Доступ к системе строго
            ограничен
          </p>
        </div>
      </section>
    </main>
  );
}
