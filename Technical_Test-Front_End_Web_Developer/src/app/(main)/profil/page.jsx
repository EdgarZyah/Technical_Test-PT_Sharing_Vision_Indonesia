"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, CreditCard, Bell, Lock, Fingerprint, Smartphone, Coins, Wallet, LogOut } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useGold } from "@/hooks/useGold";
import { formatGram, formatRupiah } from "@/lib/utils";

export default function ProfilPage() {

  const { user, logout } = useAuth();
  const { currentPrice } = useGold();

  const goldBalance = user?.goldBalance || 0;
  const rupiahBalance = user?.balance || 0;
  const goldPrice = currentPrice?.sell || 0;
  const rupiahValue = goldBalance * goldPrice;

  const profileItems = [
    { icon: User, label: "Nama Lengkap", value: user?.name || "-" },
    { icon: Mail, label: "Email", value: user?.email || "-" },
    { icon: Shield, label: "Status KYC", value: "Terverifikasi", color: "text-emerald-600 dark:text-emerald-400" },
    { icon: CreditCard, label: "Rekening Bank", value: "BCA **** 1234" },
    { icon: Bell, label: "Notifikasi", value: "Aktif" },
  ];

  const securityItems = [
    { icon: Lock, label: "Ubah PIN" },
    { icon: Fingerprint, label: "Aktivasi Biometrik" },
    { icon: Smartphone, label: "Kelola Perangkat" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 items-stretch">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="text-center h-full flex flex-col justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatGram(goldBalance)}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Saldo Emas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Ya</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">KYC</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">{formatRupiah(rupiahBalance)}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Saldo Rupiah</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatRupiah(rupiahValue)}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Nilai Emas</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
          <Card className="h-full">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Informasi Akun
            </h3>
            <div className="space-y-0">
              {profileItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  </div>
                  <span className={`text-sm font-medium ${item.color || "text-gray-900 dark:text-white"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
          <Card className="h-full">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Pengaturan Keamanan
            </h3>
            <div className="space-y-1">
              {securityItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
                >
                  <item.icon size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 text-left">{item.label}</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer"
              >
                <LogOut size={14} className="text-red-500 shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400 flex-1 text-left">Keluar dari Akun</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
