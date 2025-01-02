"use client";

import InputField from "@/components/ui/input-field";

import { Controller, FieldError, useFormContext } from "react-hook-form";
import { AvatarField } from "../common-fields";
import { DateInput } from "@/components/ui/date-input-2";
import { isEmpty, valueAsInt } from "../form-utils";

import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export const StudentRollField = () => {
  const form = useFormContext();
  const cohort_id = form.watch("cohort_id");

  return (
    <Controller
      control={form.control}
      name="roll"
      render={({ field }) => (
        <InputField
          label="Roll No."
          disabled={isEmpty(cohort_id)}
          placeholder="Student Roll"
          error={form.formState.errors.roll as FieldError}
          type="number"
          {...field}
          onChange={(e) => field.onChange(valueAsInt(e.target.value))}
        />
      )}
    />
  );
};

export const StudentAvatarField = () => {
  const form = useFormContext();

  return (
    <Controller
      control={form.control}
      name="avatar"
      render={({ field }) => <AvatarField onImageChange={field.onChange} />}
    />
  );
};

export const StudentDateOfBirthField = () => {
  const form = useFormContext();
  const error = form.formState.errors.date_of_birth;

  const errorLabelClass = error && "text-red-500";
  return (
    <div>
      <div className="label mb-2">
        <label className={cn("font-semibold", errorLabelClass)}>
          Date of Birth (dd/mm/yyyy)
        </label>
      </div>
      <Controller
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <DateInput
            icon={<Calendar className="w-4 h-4" />}
            value={field.value}
            onChange={(date) => {
              field.onChange(date);
            }}
          />
        )}
      />
      {error && typeof error.message === "string" && (
        <div className="text-red-500 text-sm mt-2">{error.message}</div>
      )}
    </div>
  );
};
