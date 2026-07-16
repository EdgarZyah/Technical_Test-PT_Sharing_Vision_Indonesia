"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionList from "@/components/features/riwayat/TransactionList";

export default function RiwayatPage() {
  const { user } = useAuth();
  const { transactions, isLoading } = useTransactions(user?.id || 0);

  return (
    <div className="space-y-4">
      <TransactionList transactions={transactions} isLoading={isLoading} />
    </div>
  );
}
