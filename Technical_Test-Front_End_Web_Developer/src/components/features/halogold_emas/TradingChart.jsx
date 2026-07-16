"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export default function TradingChart({ priceHistory, isLoading }) {
  const { isDark } = useTheme();

  const prices = useMemo(() => priceHistory.map((p) => p.buy), [priceHistory]);

  const candles = useMemo(() => {
    return priceHistory.map((p, idx) => {
      const r1 = seededRandom(idx * 7 + 1);
      const r2 = seededRandom(idx * 13 + 3);
      const r3 = seededRandom(idx * 19 + 5);
      const r4 = seededRandom(idx * 23 + 7);
      const variance = Math.floor(r1 * 2000) - 1000;
      const open = p.buy + variance;
      const close = p.buy;
      const high = Math.max(open, close) + Math.floor(r2 * 1500);
      const low = Math.min(open, close) - Math.floor(r3 * 1500);
      const volume = Math.floor(r4 * 500) + 100;
      return { date: p.date, open, close, high, low, volume, isGreen: close >= open };
    });
  }, [priceHistory]);

  const chartData = useMemo(() => {
    if (prices.length === 0) return null;

    const labels = prices.map((_, i) => {
      const d = new Date(candles[i].date);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    });

    const gradientFill = isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.06)";
    const isUp = prices[prices.length - 1] >= prices[0];
    const lineColor = isUp ? "#10b981" : "#ef4444";

    return {
      labels,
      datasets: [
        {
          data: prices,
          borderColor: lineColor,
          backgroundColor: gradientFill,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: lineColor,
          borderWidth: 1.5,
        },
      ],
    };
  }, [prices, candles, isDark]);

  const volumeData = useMemo(() => {
    return {
      labels: candles.map((c) => c.date),
      datasets: [
        {
          data: candles.map((c) => c.volume),
          backgroundColor: candles.map((c) =>
            c.isGreen ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"
          ),
          borderWidth: 0,
          borderRadius: 2,
          barPercentage: 0.6,
        },
      ],
    };
  }, [candles]);

  const gridColor = isDark ? "rgba(75, 85, 99, 0.15)" : "rgba(75, 85, 99, 0.1)";

  const priceOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        backgroundColor: isDark ? "rgba(17,24,39,0.95)" : "rgba(255,255,255,0.95)",
        titleColor: isDark ? "#9ca3af" : "#6b7280",
        bodyColor: isDark ? "#fff" : "#111827",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        titleFont: { family: "Inter", size: 11 },
        bodyFont: { family: "Inter", size: 13, weight: "bold" },
        displayColors: false,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y || 0;
            return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: isDark ? "#6b7280" : "#9ca3af", font: { family: "Inter", size: 10 }, maxTicksLimit: 8, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        position: "right",
        grid: { color: gridColor },
        ticks: {
          color: isDark ? "#6b7280" : "#9ca3af",
          font: { family: "Inter", size: 10 },
          callback: (value) => {
            const num = typeof value === "string" ? parseInt(value) : value;
            if (num >= 1000000) return `${(num / 1000000).toFixed(2)}jt`;
            return num.toLocaleString("id-ID");
          },
        },
        border: { display: false },
      },
    },
  }), [gridColor, isDark]);

  const volumeOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  }), []);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-64 sm:h-80 w-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="flex items-center gap-3 px-4 pt-3 pb-1 border-b border-gray-200 dark:border-gray-800/50">
        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">1D</span>
        <span className="text-[10px] text-gray-500">Harga harian</span>
      </div>

      <div className="px-2 pt-2">
        <div className="h-[220px] sm:h-[300px] lg:h-[350px]">
          {chartData && <Line data={chartData} options={priceOptions} />}
        </div>
      </div>

      <div className="h-12 sm:h-16 px-2 pb-2">
        {volumeData && <Line data={volumeData} options={volumeOptions} />}
      </div>
    </div>
  );
}
