"use client";

import { forwardRef } from "react";

import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { DateTimePicker, DateTimePickerRef } from "./datetime-picker";

type Props = {
  label: string;
  error?: FieldError;
  dateValue: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const DateInput = forwardRef<Partial<DateTimePickerRef>, Props>(
  ({ label, id, error, dateValue, className, onDateChange }: Props, ref) => {
    const errorInputClass = error && "border border-red-500";
    const errorLabelClass = error && "text-red-400";
    return (
      <div className="w-full space-y-2">
        <div className="label">
          <label htmlFor={id} className={cn(errorLabelClass)}>
            {label}
          </label>
        </div>
        <DateTimePicker
          value={dateValue}
          ref={ref}
          className={cn(className, errorInputClass)}
          onChange={onDateChange}
          granularity="day"
        />
        {error && <div className="text-red-700">{error.message}</div>}
      </div>
    );
  }
);

DateInput.displayName = "DateInputField";

export default DateInput;
