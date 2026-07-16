"use client";

import { useCallback, useEffect, useState } from "react";
import { mockTransactions } from "@/data/mock";

function getUserTransactions(userId) {
  return mockTransactions
    .filter((tx) => tx.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(getUserTransactions(userId));
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [userId]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setTransactions(getUserTransactions(userId));
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [userId]);

  return { transactions, isLoading, error, refetch };
}
