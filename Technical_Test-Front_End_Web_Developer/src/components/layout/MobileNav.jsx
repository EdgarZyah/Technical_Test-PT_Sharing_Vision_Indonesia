"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  History,
  User,
  LogOut,
  X,
  Coins,
} from "lucide-react";
import { classNames } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/beli-emas", label: "Beli Emas", icon: BarChart3 },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/profil", label: "Profil", icon: User },
];

export default function MobileNav({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 text-white">
                  <Coins size={22} />
                </div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Halo Emas</h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={classNames(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-amber-500/40",
                      isActive
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 w-full focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
              >
                <LogOut size={20} />
                Keluar
              </button>
            </div>
          </motion.div>

          <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} title="Konfirmasi Keluar" size="sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Apakah Anda yakin ingin keluar dari akun ini?</p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowLogoutConfirm(false)}>
                Batal
              </Button>
              <Button variant="danger" fullWidth onClick={() => { logout(); onClose(); }}>
                Keluar
              </Button>
            </div>
          </Modal>
        </>
      )}
    </AnimatePresence>
  );
}
