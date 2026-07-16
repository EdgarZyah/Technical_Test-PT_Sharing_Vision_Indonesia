import { classNames } from "@/lib/utils";

export default function Card({ children, className, padding = true }) {
  return (
    <div
      className={classNames(
        "h-full bg-white rounded-2xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700",
        padding && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
