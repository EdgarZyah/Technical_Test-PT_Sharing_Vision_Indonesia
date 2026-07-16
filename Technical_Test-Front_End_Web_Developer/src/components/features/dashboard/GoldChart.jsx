"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRupiah } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

export default function GoldChart({ data, isLoading }) {
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-48 w-full" />
      </Card>
    );
  }

  if (data.length === 0) return null;

  const labels = data.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  });

  const tickColor = isDark ? "#9ca3af" : "#9ca3af";
  const gridColor = isDark ? "rgba(156,163,175,0.08)" : "rgba(156,163,175,0.1)";
  const buyFill = isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)";
  const sellFill = isDark ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.05)";

  const chartData = {
    labels,
    datasets: [
      {
        label: "Harga Beli",
        data: data.map((d) => d.buy),
        borderColor: "#10b981",
        backgroundColor: buyFill,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#10b981",
        borderWidth: 2,
      },
      {
        label: "Harga Jual",
        data: data.map((d) => d.sell),
        borderColor: "#f59e0b",
        backgroundColor: sellFill,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#f59e0b",
        borderWidth: 2,
        borderDash: [6, 3],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      tooltip: {
        backgroundColor: isDark ? "rgba(31,41,55,0.95)" : "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: "Inter", size: 12 },
        bodyFont: { family: "Inter", size: 13 },
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label || ""}: ${formatRupiah(ctx.parsed.y || 0)}`,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxTicksLimit: 7,
          color: tickColor,
          font: { family: "Inter", size: 11 },
        },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          font: { family: "Inter", size: 11 },
          callback: (value) => {
            const num = typeof value === "string" ? parseInt(value) : value;
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
            return num.toLocaleString("id-ID");
          },
        },
      },
    },
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Grafik Harga Emas (30 Hari)
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Beli
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Jual
          </span>
        </div>
      </div>
      <div className="h-56 sm:h-64">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}
