"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Coins, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRupiah, formatGram, calculateGram, calculateRupiah } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function TradePanel({ currentPrice, userBalance, rupiahBalance = 0, isLoading }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("buy");
  const [inputMode, setInputMode] = useState("rupiah");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const buyPrice = currentPrice?.buy || 0;
  const sellPrice = currentPrice?.sell || 0;
  const activePrice = activeTab === "buy" ? buyPrice : sellPrice;

  const calculated = useMemo(() => {
    const val = parseFloat(amount) || 0;
    if (inputMode === "rupiah") {
      return { rupiah: val, gram: calculateGram(val, activePrice) };
    }
    return { rupiah: calculateRupiah(val, activePrice), gram: val };
  }, [amount, inputMode, activePrice]);

  const quickAmounts = activeTab === "buy"
    ? inputMode === "rupiah"
      ? [100000, 500000, 1000000, 5000000]
      : [0.1, 0.5, 1, 5]
    : inputMode === "rupiah"
      ? (sellPrice > 0 ? [100000, 500000, 1000000, 5000000].filter((v) => v > 0) : [])
      : (userBalance > 0 ? [0.1, 0.5, 1, 5] : []);

  const maxGram = activeTab === "sell" ? userBalance : 0;

  const handleOpenConfirm = () => {
    const val = parseFloat(amount) || 0;
    if (val <= 0) return;

    if (activeTab === "buy") {
      const cost = inputMode === "rupiah" ? val : calculated.rupiah;
      if (cost > rupiahBalance) {
        toast(`Saldo Rupiah tidak mencukupi. Saldo Anda: ${formatRupiah(rupiahBalance)}`);
        return;
      }
    } else {
      const gram = inputMode === "gram" ? val : calculated.gram;
      if (gram > userBalance) {
        toast(`Saldo emas tidak mencukupi. Saldo Anda: ${formatGram(userBalance)}`);
        return;
      }
    }

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setAmount("");
    }, 2500);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 h-full flex flex-col">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <div className="flex-1 py-3"><Skeleton className="h-4 w-20 mx-auto" /></div>
          <div className="flex-1 py-3"><Skeleton className="h-4 w-20 mx-auto" /></div>
        </div>
        <div className="p-4 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 rounded" />
            ))}
          </div>
          <div className="space-y-2.5 py-2">
            <div className="flex justify-between"><Skeleton className="h-3 w-12" /><Skeleton className="h-3 w-28" /></div>
            <div className="flex justify-between"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-28" /></div>
            <div className="flex justify-between pt-2.5 border-t border-gray-200 dark:border-gray-800"><Skeleton className="h-3.5 w-10" /><Skeleton className="h-3.5 w-28" /></div>
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 space-y-1.5">
            <div className="flex justify-between"><Skeleton className="h-3 w-14" /><Skeleton className="h-3 w-20" /></div>
            <div className="flex justify-between"><Skeleton className="h-3 w-18" /><Skeleton className="h-3 w-28" /></div>
            <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-28" /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 h-full flex flex-col lg:overflow-y-auto">
        <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0">
          <button
            onClick={() => { setActiveTab("buy"); setAmount(""); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "buy"
                ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-500/5"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Beli Emas
          </button>
          <button
            onClick={() => { setActiveTab("sell"); setAmount(""); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "sell"
                ? "text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-500/5"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Jual Emas
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => setInputMode("rupiah")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  inputMode === "rupiah"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Rupiah
              </button>
              <button
                onClick={() => setInputMode("gram")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  inputMode === "gram"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Gram
              </button>
            </div>
            {activeTab === "buy" ? (
              <button
                onClick={() => { setInputMode("rupiah"); setAmount(rupiahBalance.toString()); }}
                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer"
              >
                Saldo: {formatRupiah(rupiahBalance)}
              </button>
            ) : (
              <button
                onClick={() => { setInputMode("gram"); setAmount(maxGram.toString()); }}
                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer"
              >
                Saldo: {formatGram(maxGram)}
              </button>
            )}
          </div>

          {inputMode === "rupiah" ? (
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg font-bold pr-20 placeholder:text-gray-400 dark:placeholder:text-gray-600 [&>label]:hidden"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 dark:text-gray-400">
                IDR
              </span>
            </div>
          ) : (
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg font-bold pr-20 placeholder:text-gray-400 dark:placeholder:text-gray-600 [&>label]:hidden"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 dark:text-gray-400">
                GR
              </span>
            </div>
          )}

          {quickAmounts.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q.toString())}
                  className={`py-1.5 text-[10px] font-medium rounded transition-colors cursor-pointer ${
                    activeTab === "buy"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                  }`}
                >
                  {inputMode === "rupiah"
                    ? q >= 1000000 ? `${q / 1000000}jt` : `${q / 1000}rb`
                    : `${q} gr`}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2.5 py-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Harga</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium tabular-nums">{formatRupiah(activePrice)}/gram</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{inputMode === "rupiah" ? "Estimasi gram" : "Estimasi Rupiah"}</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium tabular-nums">
                {inputMode === "rupiah"
                  ? formatGram(calculated.gram)
                  : formatRupiah(calculated.rupiah)}
              </span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-200 dark:border-gray-800 pt-2.5">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Total</span>
              <span className={`font-bold tabular-nums ${activeTab === "buy" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {activeTab === "buy" ? formatRupiah(calculated.rupiah) : formatGram(calculated.gram)}
              </span>
            </div>
          </div>

          <Button
            variant={activeTab === "buy" ? "buy" : "sell"}
            fullWidth
            size="lg"
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={handleOpenConfirm}
            className="font-bold text-sm py-3 rounded-lg"
          >
            {activeTab === "buy" ? "Beli Emas" : "Jual Emas"}
          </Button>

          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">{activeTab === "buy" ? "Saldo Rupiah" : "Saldo Emas"}</span>
              <span className="text-gray-700 dark:text-gray-300 tabular-nums">
                {activeTab === "buy" ? formatRupiah(rupiahBalance) : formatGram(userBalance)}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Harga beli</span>
              <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{formatRupiah(buyPrice)}/gram</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Harga jual</span>
              <span className="text-red-600 dark:text-red-400 tabular-nums">{formatRupiah(sellPrice)}/gram</span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title={`Konfirmasi ${activeTab === "buy" ? "Pembelian" : "Penjualan"}`} size="sm">
        <div className="space-y-3">
          <div className={`flex items-center justify-center py-3 rounded-lg ${activeTab === "buy" ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-red-50 dark:bg-red-500/10"}`}>
            <Coins size={32} className={activeTab === "buy" ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"} />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Jenis</span>
              <span className={`font-semibold ${activeTab === "buy" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {activeTab === "buy" ? "Beli Emas" : "Jual Emas"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Harga</span>
              <span className="text-gray-900 dark:text-white font-medium tabular-nums">{formatRupiah(activePrice)}/gram</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-2">
              <span className="text-gray-500">{activeTab === "buy" ? "Total bayar" : "Total terima"}</span>
              <span className="text-gray-900 dark:text-white font-bold tabular-nums">
                {formatRupiah(calculated.rupiah)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{activeTab === "buy" ? "Emas didapat" : "Emas dijual"}</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold tabular-nums">{formatGram(calculated.gram)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowConfirm(false)}>
              Batal
            </Button>
            <Button variant={activeTab === "buy" ? "buy" : "sell"} fullWidth onClick={handleConfirm}>
              Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)} size="sm">
        <div className="text-center py-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <CheckCircle2 size={56} className={`mx-auto mb-3 ${activeTab === "buy" ? "text-emerald-500" : "text-red-500"}`} />
          </motion.div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {activeTab === "buy" ? "Pembelian Berhasil!" : "Penjualan Berhasil!"}
          </h3>
          <p className="text-sm text-gray-500">
            {formatGram(calculated.gram)} emas telah {activeTab === "buy" ? "ditambahkan ke" : "dikurangkan dari"} saldo Anda
          </p>
        </div>
      </Modal>
    </>
  );
}
