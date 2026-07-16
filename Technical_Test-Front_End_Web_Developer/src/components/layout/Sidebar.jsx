"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  History,
  User,
  LogOut,
  Sun,
  Moon,
  Coins,
} from "lucide-react";
import { classNames } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/halogold_emas", label: "Beli Emas", icon: BarChart3 },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/profil", label: "Profil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-gray-200 lg:bg-white lg:dark:bg-gray-800 lg:dark:border-gray-700 lg:fixed lg:inset-y-0 lg:left-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 text-white">
          <Coins size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">HaloGold</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Investasi Emas Digital</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-500/40",
                isActive
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white w-full transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isDark ? "Mode Terang" : "Mode Gelap"}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 w-full transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
