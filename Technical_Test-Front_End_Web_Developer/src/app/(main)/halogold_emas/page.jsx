"use client";

import { useGold } from "@/hooks/useGold";
import { useAuth } from "@/contexts/AuthContext";
import MarketHeader from "@/components/features/halogold_emas/MarketHeader";
import TradingChart from "@/components/features/halogold_emas/TradingChart";
import TradePanel from "@/components/features/halogold_emas/TradePanel";

export default function HalogoldEmasPage() {
  const { currentPrice, priceHistory, isLoading } = useGold();
  const { user } = useAuth();

  return (
    <div className="space-y-0 -mx-4 sm:-mx-6 -mt-6 bg-white dark:bg-gray-950 min-h-[calc(100vh-4rem)]">
      <MarketHeader price={currentPrice} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-0">
        <div className="order-2 lg:order-1">
          <TradingChart priceHistory={priceHistory} isLoading={isLoading} />
        </div>
        <div className="order-1 lg:order-2 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800">
          <TradePanel currentPrice={currentPrice} userBalance={user?.goldBalance || 0} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
