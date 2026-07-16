import { forwardRef } from "react";
import { classNames } from "@/lib/utils";

const Input = forwardRef(({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400",
            "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500",
            "dark:focus:border-amber-400 dark:focus:ring-amber-400/20",
            "transition-colors duration-200",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400/20",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
