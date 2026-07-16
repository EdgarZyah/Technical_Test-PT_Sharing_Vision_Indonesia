"use client";

import { useCallback, useEffect, useState } from "react";
import { mockGoldPrices } from "@/data/mock";
import { fetchGoldPrices } from "@/lib/api";

function sortPrices(prices) {
  return [...prices].sort((a, b) => a.date.localeCompare(b.date));
}

export function useGold() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  const [source, setSource] = useState("mock");

  const loadPrices = useCallback(async () => {
    setIsLoading(true);
    const apiData = await fetchGoldPrices({ length: 500 });

    if (apiData && apiData.length > 0) {
      setPriceHistory(apiData);
      setCurrentPrice(apiData[apiData.length - 1]);
      setSource("api");
    } else {
      const sorted = sortPrices(mockGoldPrices);
      setPriceHistory(sorted);
      setCurrentPrice(sorted[sorted.length - 1] || null);
      setSource("mock");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchGoldPrices({ length: 500 }).then((apiData) => {
      if (cancelled) return;

      if (apiData && apiData.length > 0) {
        setPriceHistory(apiData);
        setCurrentPrice(apiData[apiData.length - 1]);
        setSource("api");
      } else {
        const sorted = sortPrices(mockGoldPrices);
        setPriceHistory(sorted);
        setCurrentPrice(sorted[sorted.length - 1] || null);
        setSource("mock");
      }

      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { currentPrice, priceHistory, isLoading, error, refetch: loadPrices, source };
}
