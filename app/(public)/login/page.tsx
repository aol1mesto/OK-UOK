import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70 bg-white/95 animate-fade-up">
        <CardHeader>
          <CardTitle className="font-display text-3xl">Вход</CardTitle>
          <CardDescription>
            Авторизация сотрудников предприятия. Регистрация недоступна.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="underline underline-offset-4">
              Вернуться на главную
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
