"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatRupiah, formatGram } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MarketHeader({ price, isLoading }) {
  if (isLoading || !price) {
    return (
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-36 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-28 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  const prevBuy = price.buy - 1400;
  const change = price.buy - prevBuy;
  const changePercent = ((change / prevBuy) * 100).toFixed(2);
  const isUp = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
            <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">Au</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-gray-900 dark:text-white font-bold text-base sm:text-lg">GOLD/IDR</h2>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                SPOT
              </span>
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs">HaloGold Emas Digital</p>
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
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Saldo</p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 tabular-nums">{formatGram(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
