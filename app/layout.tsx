import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Finance Dashboard | HackITBA 2026",
  description:
    "Dashboard de tu cartera de inversión inteligente. Portfolio Fit Score, insights y aportes automáticos.",
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
