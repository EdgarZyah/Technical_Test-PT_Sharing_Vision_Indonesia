"use client";

import { useMemo, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { formatRupiah } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const crosshairPlugin = {
  id: "crosshair",
  afterDraw(chart) {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const { ctx } = chart;
      const { x } = activePoint.element;
      const { top, bottom } = chart.chartArea;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(156,163,175,0.3)";
      ctx.lineWidth = 1;
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.restore();
    }
  },
};

export default function TradingChart({ priceHistory, isLoading }) {
  const { isDark } = useTheme();
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const chart = chartRef.current;
      if (chart) chart.resize();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const buyPrices = useMemo(() => priceHistory.map((p) => p.buy), [priceHistory]);
  const sellPrices = useMemo(() => priceHistory.map((p) => p.sell), [priceHistory]);

  const allPrices = useMemo(() => [...buyPrices, ...sellPrices].filter(Boolean), [buyPrices, sellPrices]);
  const minPrice = useMemo(() => (allPrices.length > 0 ? Math.min(...allPrices) : 0), [allPrices]);
  const maxPrice = useMemo(() => (allPrices.length > 0 ? Math.max(...allPrices) : 0), [allPrices]);

  const chartData = useMemo(() => {
    if (buyPrices.length === 0) return null;

    const labels = priceHistory.map((p) => {
      const d = new Date(p.date);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    });

    const buyUp = buyPrices[buyPrices.length - 1] >= buyPrices[0];
    const buyColor = "#10b981";
    const sellColor = "#f59e0b";
    const fillColorTop = isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.10)";

    return {
      labels,
      datasets: [
        {
          label: "Harga Beli",
          data: buyPrices,
          borderColor: buyColor,
          backgroundColor: (ctx) => {
            if (!ctx.chart.chartArea) return fillColorTop;
            const { top, bottom } = ctx.chart.chartArea;
            const gradient = ctx.chart.ctx.createLinearGradient(0, top, 0, bottom);
            gradient.addColorStop(0, fillColorTop);
            gradient.addColorStop(0.6, isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)");
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: buyColor,
          pointHoverBorderColor: isDark ? "#1f2937" : "#ffffff",
          pointHoverBorderWidth: 2,
          borderWidth: 2,
        },
        {
          label: "Harga Jual",
          data: sellPrices,
          borderColor: sellColor,
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: sellColor,
          pointHoverBorderColor: isDark ? "#1f2937" : "#ffffff",
          pointHoverBorderWidth: 2,
          borderWidth: 2,
          borderDash: [6, 3],
        },
      ],
    };
  }, [buyPrices, sellPrices, priceHistory, isDark]);

  const gridColor = isDark ? "rgba(75, 85, 99, 0.12)" : "rgba(75, 85, 99, 0.08)";

  const priceOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: "easeOutQuart" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? "rgba(17,24,39,0.96)" : "rgba(255,255,255,0.98)",
        titleColor: isDark ? "#9ca3af" : "#6b7280",
        bodyColor: isDark ? "#f3f4f6" : "#111827",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        cornerRadius: 8,
        titleFont: { family: "Inter", size: 11, weight: "400" },
        bodyFont: { family: "Inter", size: 14, weight: "700" },
        displayColors: false,
        caretSize: 0,
        callbacks: {
          title: (items) => {
            if (!items.length) return "";
            const idx = items[0].dataIndex;
            const d = new Date(priceHistory[idx]?.date);
            return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
          },
          label: (ctx) => {
            const val = ctx.parsed.y || 0;
            return `  ${ctx.dataset.label}: ${formatRupiah(val)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: isDark ? "#6b7280" : "#9ca3af",
          font: { family: "Inter", size: 10 },
          maxTicksLimit: 7,
          maxRotation: 0,
          padding: 8,
        },
        border: { display: false },
      },
      y: {
        position: "right",
        grid: { color: gridColor, drawTicks: false },
        border: { display: false },
        ticks: {
          color: isDark ? "#6b7280" : "#9ca3af",
          font: { family: "Inter", size: 10 },
          padding: 12,
          maxTicksLimit: 6,
          callback: (value) => {
            if (value == null || isNaN(value)) return "";
            const num = typeof value === "string" ? parseInt(value, 10) : value;
            if (isNaN(num)) return "";
            if (num >= 1000000) return `${(num / 1000000).toFixed(2)}jt`;
            return num.toLocaleString("id-ID");
          },
        },
        suggestedMin: minPrice > 0 ? minPrice - (maxPrice - minPrice) * 0.1 : undefined,
        suggestedMax: maxPrice > 0 ? maxPrice + (maxPrice - minPrice) * 0.1 : undefined,
      },
    },
  }), [gridColor, isDark, priceHistory, minPrice, maxPrice]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-none lg:rounded-2xl border-0 lg:border border-gray-200 dark:border-gray-800 h-full flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-5 w-28 ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>
        <div className="px-3 pb-4 flex-1 min-h-0">
          <div className="h-[260px] sm:h-[340px] lg:h-full flex items-end gap-1 px-4 pb-8 pt-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${30 + Math.random() * 60}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const latestBuy = buyPrices[buyPrices.length - 1];
  const prevBuy = buyPrices[buyPrices.length - 2];
  const change = latestBuy && prevBuy ? latestBuy - prevBuy : 0;
  const isUp = change >= 0;
  const latestSell = sellPrices[sellPrices.length - 1];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-none border-0 lg:border border-gray-200 dark:border-gray-800 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Grafik Harga Emas</h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Harga harian 1 gram</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className="w-3 h-0.5 rounded bg-emerald-500 inline-block" />
              Beli
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
              <svg width="12" height="2"><line x1="0" y1="1" x2="12" y2="1" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" /></svg>
              Jual
            </span>
          </div>
        </div>
        {latestBuy && (
          <div className="text-right">
            <p className="text-base font-bold text-gray-900 dark:text-white tabular-nums">{formatRupiah(latestBuy)}</p>
            <p className={`text-[11px] font-medium tabular-nums ${isUp ? "text-emerald-500" : "text-red-500"}`}>
              {isUp ? "+" : ""}{formatRupiah(change)} hari ini
            </p>
            {latestSell && (
              <p className="text-[11px] text-amber-500 dark:text-amber-400 tabular-nums mt-0.5">
                Jual: {formatRupiah(latestSell)}
              </p>
            )}
          </div>
        )}
      </div>

      <div ref={containerRef} className="px-3 pb-4 flex-1 min-h-0">
        <div className="h-[260px] sm:h-[340px] lg:h-full">
          {chartData && <Line ref={chartRef} data={chartData} options={priceOptions} plugins={[crosshairPlugin]} />}
        </div>
      </div>
    </div>
  );
}
