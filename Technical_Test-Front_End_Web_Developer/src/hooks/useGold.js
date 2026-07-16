"use client";

import { useCallback, useEffect, useState } from "react";
import { mockGoldPrices } from "@/data/mock";

function sortPrices(prices) {
  return [...prices].sort((a, b) => a.date.localeCompare(b.date));
}

export function useGold() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const sorted = sortPrices(mockGoldPrices);
      setCurrentPrice(sorted[sorted.length - 1] || null);
      setPriceHistory(sorted);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const sorted = sortPrices(mockGoldPrices);
      setCurrentPrice(sorted[sorted.length - 1] || null);
      setPriceHistory(sorted);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { currentPrice, priceHistory, isLoading, error, refetch };
}
