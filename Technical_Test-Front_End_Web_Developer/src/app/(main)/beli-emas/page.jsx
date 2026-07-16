"use client";

import { useEffect } from "react";
import { useGold } from "@/hooks/useGold";
import { useAuth } from "@/contexts/AuthContext";
import MarketHeader from "@/components/features/trading/MarketHeader";
import TradingChart from "@/components/features/trading/TradingChart";
import TradePanel from "@/components/features/trading/TradePanel";

function useDisableZoom() {
  useEffect(() => {
    const preventKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].includes(e.key)) {
        e.preventDefault();
      }
    };
    const preventWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };

    window.addEventListener("keydown", preventKey, { passive: false });
    window.addEventListener("wheel", preventWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", preventKey);
      window.removeEventListener("wheel", preventWheel);
    };
  }, []);
}

export default function BeliEmasPage() {
  const { currentPrice, priceHistory, isLoading } = useGold();
  const { user } = useAuth();

  useDisableZoom();

  return (
    <div className="space-y-0 -mx-4 sm:-mx-6 -mt-6 bg-white dark:bg-gray-950 h-min relative">
      <img
        src="/images/gold-bar.png"
        alt=""
        className="absolute top-14 left-1/2 -translate-x-1/2 w-48 h-48 opacity-[0.04] select-none pointer-events-none hidden lg:block"
      />
      <MarketHeader price={currentPrice} priceHistory={priceHistory} userBalance={user?.goldBalance || 0} rupiahBalance={user?.balance || 0} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-0 items-stretch">
        <div className="order-2 lg:order-1 min-h-0">
          <TradingChart priceHistory={priceHistory} isLoading={isLoading} />
        </div>
        <div className="order-1 lg:order-2 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 min-h-0">
          <TradePanel currentPrice={currentPrice} userBalance={user?.goldBalance || 0} rupiahBalance={user?.balance || 0} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
