import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Portfolio Builder | HackITBA 2026",
  description:
    "Armá tu cartera de inversión personalizada con inteligencia artificial. Perfilado, cartera sugerida, Portfolio Doctor y simulador what-if.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
