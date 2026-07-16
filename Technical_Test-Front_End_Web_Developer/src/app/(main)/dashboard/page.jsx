"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useGold } from "@/hooks/useGold";
import { useTransactions } from "@/hooks/useTransactions";
import BalanceCard from "@/components/features/dashboard/BalanceCard";
import GoldPriceCard from "@/components/features/dashboard/GoldPriceCard";
import GoldChart from "@/components/features/dashboard/GoldChart";
import QuickActions from "@/components/features/dashboard/QuickActions";
import RecentTransactions from "@/components/features/dashboard/RecentTransactions";

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentPrice, priceHistory, isLoading: goldLoading } = useGold();
  const { transactions, isLoading: txLoading } = useTransactions(user?.id || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceCard
          userName={user?.name || "User"}
          goldBalance={user?.goldBalance || 0}
          goldPrice={currentPrice?.buy || 0}
          isLoading={goldLoading}
        />
        <GoldPriceCard price={currentPrice} isLoading={goldLoading} />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <GoldChart data={priceHistory} isLoading={goldLoading} />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions} isLoading={txLoading} />
        </div>
      </div>
    </div>
  );
}
