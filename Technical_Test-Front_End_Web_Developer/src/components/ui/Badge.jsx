import { classNames } from "@/lib/utils";

const variantStyles = {
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  default: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

export default function Badge({ children, variant = "default", size = "sm" }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center font-medium rounded-full",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    SUCCESS: { label: "Berhasil", variant: "success" },
    PENDING: { label: "Pending", variant: "warning" },
    FAILED: { label: "Gagal", variant: "danger" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function TypeBadge({ type }) {
  const map = {
    BUY: { label: "Beli", variant: "info" },
    SELL: { label: "Jual", variant: "success" },
  };
  const { label, variant } = map[type];
  return <Badge variant={variant}>{label}</Badge>;
}
