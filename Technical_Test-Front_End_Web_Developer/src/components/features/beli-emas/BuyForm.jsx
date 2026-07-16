"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Coins, CheckCircle2, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRupiah, formatGram, calculateGram } from "@/lib/utils";

const buySchema = z.object({
  amount: z
    .number({ message: "Nominal harus berupa angka" })
    .min(50000, "Nominal minimal Rp 50.000")
    .max(100000000, "Nominal maksimal Rp 100.000.000"),
});

export default function BuyForm({ goldPrice, isLoading, onBuy }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(buySchema),
    defaultValues: { amount: 0 },
  });

  const amount = watch("amount") || 0;
  const gram = useMemo(() => calculateGram(amount, goldPrice || 0), [amount, goldPrice]);

  const onSubmit = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onBuy?.(amount);
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      reset();
    }, 3000);
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Beli Emas
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Masukkan nominal Rupiah yang ingin dibelikan emas
              </p>
            </div>

            {goldPrice && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl dark:bg-amber-900/10">
                <Coins size={16} className="text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-amber-700 dark:text-amber-400">
                  Harga emas: <strong>{formatRupiah(goldPrice)}/gram</strong>
                </span>
              </div>
            )}

            <Input
              label="Nominal Rupiah"
              type="number"
              placeholder="Masukkan nominal (min. Rp 50.000)"
              leftIcon={<span className="text-sm font-semibold">Rp</span>}
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />

            {amount > 0 && goldPrice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gray-50 rounded-xl p-4 space-y-3 dark:bg-gray-700/50"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Harga per gram</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatRupiah(goldPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Nominal beli</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatRupiah(amount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Anda akan mendapat
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {formatGram(gram)}
                  </span>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={!amount || amount < 50000}
            >
              Beli Emas Sekarang
              <ArrowRight size={18} className="ml-2" />
            </Button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Harga akan dikunci selama 5 menit setelah konfirmasi
            </p>
          </form>
        </Card>
      </motion.div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Konfirmasi Pembelian">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 dark:bg-gray-700/50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Nominal</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Harga/gram</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatRupiah(goldPrice || 0)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-600 pt-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Emas yang didapat</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{formatGram(gram)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowConfirm(false)}>
              Batal
            </Button>
            <Button fullWidth onClick={handleConfirm}>
              Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="text-center py-4">
          <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Pembelian Berhasil!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatGram(gram)} emas telah ditambahkan ke saldo Anda
          </p>
        </div>
      </Modal>
    </>
  );
}
