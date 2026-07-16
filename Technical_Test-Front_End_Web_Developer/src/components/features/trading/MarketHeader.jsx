"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { formatRupiah, formatGram } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MarketHeader({ price, priceHistory = [], userBalance = 0, rupiahBalance = 0, isLoading }) {
  if (isLoading || !price) {
    return (
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-7 w-36" />
          <div className="hidden md:flex items-center gap-5 ml-auto">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-8" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-8" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sorted = [...priceHistory].sort((a, b) => a.date.localeCompare(b.date));
  const currentIdx = sorted.findIndex((p) => p.date === price.date);
  const prevPrice = currentIdx > 0 ? sorted[currentIdx - 1] : sorted[sorted.length - 2];
  const change = prevPrice ? price.buy - prevPrice.buy : 0;
  const changePercent = prevPrice && prevPrice.buy > 0
    ? ((change / prevPrice.buy) * 100).toFixed(2)
    : "0.00";
  const isUp = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <Image src="/images/gold-bar.png" alt="" width={28} height={28} unoptimized className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-gray-900 dark:text-white font-bold text-base sm:text-lg">GOLD/IDR</h2>
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs">Halo Emas Emas Digital</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.span
            key={price.buy}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className={`text-xl sm:text-2xl font-bold tabular-nums ${isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {formatRupiah(price.buy)}
          </motion.span>
          <div className="flex items-center gap-0.5">
            {isUp ? (
              <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown size={12} className="text-red-600 dark:text-red-400" />
            )}
            <span className={`text-xs font-medium tabular-nums ${isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {isUp ? "+" : ""}{changePercent}%
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 ml-auto">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Beli</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatRupiah(price.buy)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Jual</p>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums">{formatRupiah(price.sell)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Saldo Emas</p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 tabular-nums">{formatGram(userBalance)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Saldo Rupiah</p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 tabular-nums">{formatRupiah(rupiahBalance)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
