"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useGold } from "@/hooks/useGold";
import { useTransactions } from "@/hooks/useTransactions";
import BalanceCard from "@/components/features/dashboard/BalanceCard";
import GoldPricePanel from "@/components/features/dashboard/GoldPricePanel";
import GoldChart from "@/components/features/dashboard/GoldChart";
import QuickActions from "@/components/features/dashboard/QuickActions";
import RecentTransactions from "@/components/features/dashboard/RecentTransactions";

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentPrice, priceHistory, isLoading: goldLoading } = useGold();
  const { transactions, isLoading: txLoading } = useTransactions(user?.id || 0);

  return (
    <div className="space-y-6 relative">
      <img
        src="/images/gold-bar.png"
        alt=""
        className="absolute -top-2 -right-2 w-36 h-36 opacity-[0.06] -rotate-12 select-none pointer-events-none hidden lg:block"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceCard
          userName={user?.name || "User"}
          goldBalance={user?.goldBalance || 0}
          rupiahBalance={user?.balance || 0}
          goldPrice={currentPrice?.sell || 0}
          isLoading={goldLoading}
        />
        <GoldPricePanel price={currentPrice} priceHistory={priceHistory} isLoading={goldLoading} />
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
