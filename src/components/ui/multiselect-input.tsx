// src/app/page.tsx

"use client";

import React, { useState } from "react";

import { Cat, Dog, Fish, LoaderCircle, Rabbit, Turtle } from "lucide-react";
import { MultiSelect } from "./multiselect";
import { FieldError } from "react-hook-form";
import { InputSkeleton } from "./skeleton/input-skeleton";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  error?: FieldError;
  isLoading?: boolean;
} & React.ComponentProps<typeof MultiSelect>;
export function MultiSelectInput({
  label,
  error,
  isLoading,
  className,
  ...rest
}: Props) {
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
          {isLoading && <LoaderCircle className="animate-spin w-3 h-3 mt-1" />}
        </label>
      </div>
      {isLoading && <InputSkeleton />}
      {!isLoading && (
        <MultiSelect
          className={cn(className, errorInputClass)}
          {...rest}
          variant="inverted"
          maxCount={3}
        />
      )}
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
    </div>
  );
}
