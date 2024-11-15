"use client";

import { forwardRef } from "react";

import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Combobox } from "../shadcn/ui/combobox";

import { InputSkeleton } from "./skeleton/input-skeleton";
import { LoaderCircle } from "lucide-react";

type Props = {
  label: string;
  error?: FieldError;
  isLoading?: boolean;
} & React.ComponentProps<typeof Combobox>;

type SelectRefType = React.ElementRef<typeof Combobox>;

export const SelectInput = forwardRef<SelectRefType, Props>(
  (
    {
      label,
      error,
      options,
      triggerClassName,
      isLoading,

      ...rest
    }: Props,
    ref
  ) => {
    const errorInputClass = error && "border border-red-500";
    const errorLabelClass = error && "text-red-500";

    return (
      <div className="w-full space-y-2">
        <div className="label">
          <label
            className={cn(
              "flex items-center gap-2 font-semibold",
              errorLabelClass
            )}
          >
            {label}
            {isLoading && (
              <LoaderCircle className="animate-spin w-3 h-3 mt-1" />
            )}
          </label>
        </div>
        {isLoading && <InputSkeleton />}
        {!isLoading && (
          <Combobox
            options={options}
            {...rest}
            ref={ref}
            triggerClassName={cn(triggerClassName, errorInputClass)}
          />
        )}
        {error && <div className="text-red-500 text-sm">{error.message}</div>}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";
