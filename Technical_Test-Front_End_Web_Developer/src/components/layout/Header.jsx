"use client";

import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header({ onMenuToggle, title }) {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
          >
            <Menu size={22} />
          </button>
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
              {title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
            title={isDark ? "Mode Terang" : "Mode Gelap"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name || "User"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
