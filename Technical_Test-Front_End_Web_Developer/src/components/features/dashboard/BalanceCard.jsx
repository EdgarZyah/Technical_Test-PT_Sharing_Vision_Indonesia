"use client";

import { motion } from "framer-motion";
import { Coins, Wallet, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatGram, formatRupiah } from "@/lib/utils";

export default function BalanceCard({
  userName,
  goldBalance,
  rupiahBalance = 0,
  goldPrice,
  isLoading,
}) {
  const rupiahValue = goldBalance * goldPrice;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-amber-600 p-5">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-3/4 bg-amber-400/50" />
          <div>
            <Skeleton className="h-8 w-32 mb-2 bg-amber-400/50" />
            <Skeleton className="h-4 w-24 bg-amber-400/50" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-400/30">
            <Skeleton className="h-8 w-full bg-amber-400/50" />
            <Skeleton className="h-8 w-full bg-amber-400/50" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl bg-amber-400/50" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-amber-600 text-white relative overflow-hidden p-5">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <Image
          src="/images/gold-bar.png"
          alt=""
          width={112}
          height={112}
          unoptimized
          className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 rotate-12 select-none pointer-events-none"
        />

        {/* Konten Utama */}
        <div className="relative flex flex-col gap-3.5">
          
          {/* Header */}
          <div>
            <p className="text-amber-50 text-lg font-medium leading-tight">
              Selamat datang, {userName}
            </p>
            <p className="text-amber-100/80 text-xs mt-0.5">Total Saldo Emas</p>
          </div>

          {/* Nominal Utama */}
          <div>
            <div className="flex items-center gap-2">
              <Coins size={26} className="text-amber-100" />
              <span className="text-3xl font-bold tracking-tight">
                {formatGram(goldBalance)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-100/90 mt-1">
              <Wallet size={14} />
              <span className="text-sm font-medium">≈ {formatRupiah(rupiahValue)}</span>
            </div>
          </div>

          {/* Info Tambahan (Grid) */}
          <div className="grid grid-cols-1 gap-5 pt-3 border-t border-white/20">
            <div>
              <p className="text-amber-100/80 text-[10px] uppercase tracking-wider mb-0.5">
                Saldo Rupiah
              </p>
              <p className="text-sm font-bold tabular-nums leading-none">
                {formatRupiah(rupiahBalance)}
              </p>
            </div>
            <div>
              <p className="text-amber-100/80 text-[10px] uppercase tracking-wider mb-0.5">
                Harga Buyback
              </p>
              <p className="text-sm font-bold tabular-nums leading-none">
                {formatRupiah(goldPrice)}/gr
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <Link
            href="/beli-emas"
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors mt-1"
          >
            Beli Emas Sekarang
            <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}