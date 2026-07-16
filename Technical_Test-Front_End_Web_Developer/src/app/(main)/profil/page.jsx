"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, CreditCard, Bell } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilPage() {
  const { user } = useAuth();

  const profileItems = [
    { icon: User, label: "Nama Lengkap", value: user?.name || "-" },
    { icon: Mail, label: "Email", value: user?.email || "-" },
    { icon: Shield, label: "Status KYC", value: "Terverifikasi", color: "text-emerald-600 dark:text-emerald-400" },
    { icon: CreditCard, label: "Rekening Bank", value: "BCA **** 1234" },
    { icon: Bell, label: "Notifikasi", value: "Aktif" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Informasi Akun
          </h3>
          <div className="space-y-4">
            {profileItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700">
                    <item.icon size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Pengaturan Keamanan
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Ubah PIN</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Aktivasi Biometrik</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Kelola Perangkat</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
