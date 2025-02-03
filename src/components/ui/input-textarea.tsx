"use client";

import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea } from "../shadcn/ui/textarea";

type Props = {
  label: string;
  error?: FieldError;
} & React.ComponentProps<"textarea">;

const InputTextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, name, id, error, className, cols, rows, ...rest }: Props, ref) => {
    const errorInputClass =
      error &&
      "ring-1 ring-red-500 focus-within:ring-red-500 focus-within:ring-2";
    const errorLabelClass = error && "text-red-500";
    return (
      <div className="w-full space-y-2">
        <div className="label">
          <label htmlFor={id} className={cn("font-semibold", errorLabelClass)}>
            {label}
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Textarea
            cols={cols}
            rows={rows}
            name={name}
            ref={ref}
            className={cn("bg-white", className, errorInputClass)}
            {...rest}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error.message}</div>}
      </div>
    );
  }
);

InputTextArea.displayName = "InputTextArea";

export default InputTextArea;
