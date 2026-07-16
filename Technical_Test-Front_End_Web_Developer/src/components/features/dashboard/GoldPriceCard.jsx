"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRupiah } from "@/lib/utils";

export default function GoldPriceCard({ price, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-4 w-28 mb-3" />
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-3 w-24" />
      </Card>
    );
  }

  if (!price) return null;

  const change = price.buy - (price.sell + 2000);
  const isUp = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Harga Emas Hari Ini</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatRupiah(price.buy)}
          </span>
          <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-0.5 rounded-full">
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            0.07%
          </span>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Beli: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatRupiah(price.buy)}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown size={14} className="text-red-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Jual: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatRupiah(price.sell)}</span>
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
