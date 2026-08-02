import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "OpenBoxes Lite \u2013 Medicine Donation Tracker",
  description: "Lightweight inventory system for tracking medicine donations, lots, and expiry dates. Inspired by OpenBoxes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Sidebar />
        <main className="pl-64">
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
