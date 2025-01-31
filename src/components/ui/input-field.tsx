"use client";

import { forwardRef } from "react";
import { Input } from "../shadcn/ui/input";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  error?: FieldError;
  rightIcon?: JSX.Element;
  icon?: JSX.Element;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, Props>(
  (
    { label, name, id, error, className, rightIcon, icon, ...rest }: Props,
    ref
  ) => {
    const errorInputClass =
      error &&
      "ring-1 ring-red-500 focus-within:ring-red-500 focus-within:ring-2";
    const errorLabelClass = error && "text-red-500";
    return (
      <div className="w-full space-y-2">
        {label && (
          <div className="label">
            <label
              htmlFor={id}
              className={cn("font-semibold", errorLabelClass)}
            >
              {label}
            </label>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Input
            icon={icon}
            name={name}
            {...rest}
            ref={ref}
            className={cn("bg-white", className, errorInputClass)}
          />

          {rightIcon}
        </div>
        {error && <div className="text-red-500 text-sm">{error.message}</div>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
