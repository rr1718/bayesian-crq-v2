import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Darktrace ActiveAI Security Platform",
  description:
    "AI-native cybersecurity platform with self-learning threat detection, autonomous response, and full network visibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ scrollBehavior: "smooth" }}>
      <body className="h-full bg-background text-foreground font-sans overflow-hidden">
        {children}
      </body>
    </html>
  );
}
