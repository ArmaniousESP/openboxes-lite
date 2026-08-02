"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  History,
  HeartPulse,
} from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/transactions", label: "Transactions", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold tracking-tight">OpenBoxes Lite</div>
          <div className="text-xs text-slate-400">Medicine Donations</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700 text-xs text-slate-500">
        Inspired by OpenBoxes \u00b7 Armanious Foundation
      </div>
    </aside>
  );
}
