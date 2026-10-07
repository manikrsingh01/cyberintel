import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://project-cyberintel.manikumarsingh.com"),
  title: "CyberIntel - AI Sales Intelligence Platform",
  description: "B2B Sales Intelligence Platform for Cybersecurity Software Companies. Identify, prioritize, and target in-market enterprise accounts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 min-h-screen font-sans antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
