"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, TrendingDown, Target, User } from "lucide-react";

const actions = [
  { href: "/beli-emas", label: "Beli Emas", icon: BarChart3, color: "bg-amber-500" },
  { href: "/riwayat", label: "Riwayat", icon: TrendingDown, color: "bg-emerald-500" },
  { href: "/dashboard", label: "Target Emas", icon: Target, color: "bg-blue-500" },
  { href: "/profil", label: "Profil", icon: User, color: "bg-purple-500" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, i) => (
        <motion.div
          key={action.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.05 }}
        >
          <Link
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-amber-500/40"
          >
            <div className={`p-2.5 rounded-xl ${action.color} text-white`}>
              <action.icon size={20} />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
              {action.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
