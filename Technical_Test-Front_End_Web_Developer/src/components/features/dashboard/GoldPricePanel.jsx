"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRupiah, formatDate, formatDateTime } from "@/lib/utils";

export default function GoldPricePanel({ price, priceHistory, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-3 w-28 mb-4" />
        <Skeleton className="h-px w-full mb-4" />
        <Skeleton className="h-4 w-36 mb-3" />
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-3 w-28 mb-4" />
        <Skeleton className="h-px w-full mb-4" />
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-6 w-36 mb-2" />
        <Skeleton className="h-3 w-40" />
      </Card>
    );
  }

  if (!price || !priceHistory || priceHistory.length < 2) return null;

  const sorted = [...priceHistory].sort((a, b) => a.date.localeCompare(b.date));
  const currentPrice = sorted[sorted.length - 1];
  const previousPrice = sorted[sorted.length - 2];
  const change = currentPrice.buy - previousPrice.buy;
  const isUp = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="overflow-hidden">
        <div className="space-y-0">
          <div className="pb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Harga Emas 1 gram
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-1.5">
              {formatDate(currentPrice.date)}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              {formatRupiah(currentPrice.buy)}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 pb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Harga Sebelumnya
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-1.5">
              {formatDate(previousPrice.date)}
            </p>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300 tabular-nums">
              {formatRupiah(previousPrice.buy)}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Perubahan
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-1.5">
              {formatDateTime(currentPrice.date)}
            </p>
            <div className="flex items-center gap-1.5">
              {isUp ? (
                <TrendingUp size={16} className="text-emerald-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span
                className={`text-lg font-bold tabular-nums ${
                  isUp
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatRupiah(change)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
