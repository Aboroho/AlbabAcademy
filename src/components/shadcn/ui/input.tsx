import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = {
  icon?: JSX.Element;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex  items-center w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring overflow-hidden",
          className
        )}
      >
        {icon && (
          <div className="flex items-center justify-center w-9 h-9 border-r bg-slate-100">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex pl-2 h-9 w-full  bg-transparent py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
