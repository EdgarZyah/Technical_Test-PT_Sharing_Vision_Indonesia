"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { TypeBadge, StatusBadge } from "@/components/ui/Badge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { formatRupiah, formatGram, formatDateTime } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

const filterOptions = [
  { value: "ALL", label: "Semua" },
  { value: "BUY", label: "Beli" },
  { value: "SELL", label: "Jual" },
];

export default function TransactionList({ transactions, isLoading }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = transactions;
    if (filter !== "ALL") {
      result = result.filter((tx) => tx.type === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.type.toLowerCase().includes(q) ||
          tx.status.toLowerCase().includes(q) ||
          formatRupiah(tx.rupiahAmount).toLowerCase().includes(q) ||
          formatGram(tx.gramAmount).toLowerCase().includes(q)
      );
    }
    return result;
  }, [transactions, filter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <Card>
        <SkeletonTable rows={6} />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Cari transaksi..."
            leftIcon={<Search size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFilter(opt.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer ${
                filter === opt.value
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Filter size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Tidak ada transaksi ditemukan</p>
          </div>
        </Card>
      ) : (
        <>
          <Card padding={false} className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nominal
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Berat
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Harga/gram
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {paginated.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatDateTime(tx.date)}
                      </td>
                      <td className="px-5 py-4">
                        <TypeBadge type={tx.type} />
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatRupiah(tx.rupiahAmount)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatGram(tx.gramAmount)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatRupiah(tx.goldPrice)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-3 md:hidden">
            {paginated.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TypeBadge type={tx.type} />
                      <StatusBadge status={tx.status} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(tx.date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatRupiah(tx.rupiahAmount)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatGram(tx.gramAmount)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      @ {formatRupiah(tx.goldPrice)}/gr
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-amber-500/40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
