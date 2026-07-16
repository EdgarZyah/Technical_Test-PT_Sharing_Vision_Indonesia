"use client";

import { motion } from "framer-motion";
import { Coins, TrendingUp, Wallet } from "lucide-react";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatGram, formatRupiah } from "@/lib/utils";

export default function BalanceCard({
  userName,
  goldBalance,
  goldPrice,
  isLoading,
}) {
  const rupiahValue = goldBalance * goldPrice;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-amber-600">
        <Skeleton className="h-4 w-24 mb-3 bg-amber-400/50" />
        <Skeleton className="h-10 w-40 mb-2 bg-amber-400/50" />
        <Skeleton className="h-4 w-32 bg-amber-400/50" />
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-amber-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <p className="text-amber-100 text-sm font-medium mb-1">
            Selamat datang, {userName}
          </p>
          <p className="text-amber-100 text-xs mb-4">Total Saldo Emas</p>

          <div className="flex items-center gap-2 mb-1">
            <Coins size={24} />
            <span className="text-3xl font-bold">{formatGram(goldBalance)}</span>
          </div>

          <div className="flex items-center gap-2 text-amber-100">
            <Wallet size={16} />
            <span className="text-sm">{formatRupiah(rupiahValue)}</span>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
            <TrendingUp size={14} />
            <span className="text-xs text-amber-100">
              Harga beli: {formatRupiah(goldPrice)}/gram
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
