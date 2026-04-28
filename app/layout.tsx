import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // <-- Imports the popup notifications

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fenmo Expense Tracker",
  description: "A production-ready expense tracker for Fenmo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Toaster placed here so it's available everywhere in the app */}
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}