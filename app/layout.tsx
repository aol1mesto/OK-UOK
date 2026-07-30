import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-literata",
});

export const metadata: Metadata = {
  title: "Корпоративный портал",
  description: "Личный кабинет предприятия для аудита и контроля качества",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${literata.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
