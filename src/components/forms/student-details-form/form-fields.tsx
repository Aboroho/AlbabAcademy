"use client";

import InputField from "@/components/ui/input-field";

import { Controller, FieldError, useFormContext } from "react-hook-form";
import { AvatarField } from "../common-fields";
import DateInput from "@/components/ui/date-input";
import { isEmpty, valueAsInt } from "../form-utils";

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
  return (
    <Controller
      control={form.control}
      name="date_of_birth"
      render={({ field }) => (
        <DateInput
          error={form.formState.errors.date_of_birth as FieldError}
          onDateChange={field.onChange}
          dateValue={field.value}
          label="Date of birth"
        />
      )}
    />
  );
};
