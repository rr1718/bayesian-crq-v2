import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Darktrace ActiveAI Security Platform",
  description:
    "Enterprise-grade, AI-native cybersecurity platform built on a decade of machine learning research. Protecting nearly 10,000 customers globally.",
  keywords: [
    "Darktrace",
    "ActiveAI",
    "cybersecurity",
    "self-learning AI",
    "NDR",
    "threat detection",
    "autonomous response",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ scrollBehavior: "smooth" }}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
