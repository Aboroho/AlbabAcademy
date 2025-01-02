import { FailedApiResponse } from "@/types/common";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { Skeleton } from "../shadcn/ui/skeleton";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export type IBaseValidationResultFormat = {
  [key: string]: { message: string } | IBaseValidationResultFormat;
};
export function showErrors(errors: IBaseValidationResultFormat) {
  if (!errors || typeof errors !== "object") return null;
  const errorMap = Object.entries(errors).slice(0, 3);

  return (
    <div className="space-y-4">
      {errorMap.map((error) => {
        if (error && error[1] && !error[1]?.hasOwnProperty("message"))
          return showErrors(error[1] as IBaseValidationResultFormat);
        return (
          <div key={error[0]} className="flex gap-4">
            {/* {error[1]?.message && (
              <div className="font-semibold text-red-600">{error[0]}:</div>
            )} */}
            <div className=" text-red-500">{error[1]?.message as string}</div>
          </div>
        );
      })}
    </div>
  );
}

export function FormSection({ children, title }: Props) {
  return (
    <div className="space-y-4 p-4 pb-8 rounded-md border shadow-md ">
      {title && <h3 className="text-lg mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function noRecordFoundFallback() {
  return (
    <div className="p-10 bg-red-100 text-red-500 text-center rounded-md">
      No record found
    </div>
  );
}

export function renderFormSkeleton() {
  return (
    <div className="p-4  mx-auto">
      {/* Form Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-1/2" />
      </div>

      {/* Two-Column Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div>
          {/* Label Placeholder */}
          <Skeleton className="h-5 w-1/3 mb-2" />
          {/* Input Field Placeholder */}
          <Skeleton className="h-10 w-full mb-4" />

          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full mb-4" />

          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full mb-4" />
        </div>

        {/* Column 2 */}
        <div>
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full mb-4" />

          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full mb-4" />

          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full mb-4" />
        </div>
      </div>

      {/* Form Actions */}
      <div className=" flex justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
export function resolveFormError<T extends FieldValues>(
  res: FailedApiResponse,
  form: UseFormReturn<T>
) {
  if (res.message) {
    toast.dismiss("student_create_error");
    toast.error(res.message, { id: "student_create_error" });
  }

  if (res.errorDetails instanceof Object) {
    console.log(res.errorDetails);
    Object.entries(res.errorDetails).forEach(([fieldName, error]) => {
      console.log(fieldName);
      const fName = ["avatar", "email", "phone", "username"].includes(fieldName)
        ? `user.${fieldName}`
        : fieldName;
      form.setError(
        fName as Path<T>,
        {
          message: error.message,
        },
        { shouldFocus: true }
      );
      console.log(fieldName, error);
    });
  }
}

export function valueAsInt(str: number | string | undefined | null) {
  if (!str) return undefined;
  if (typeof str === "number") return str;
  const x = parseInt(str);
  console.log(x);
  if (isNaN(x)) return undefined;
  return x;
}

export function valueAsIntF(fn: (arg: number | undefined) => unknown) {
  return (str: number | string | undefined | null) => {
    return fn(valueAsInt(str));
  };
}

/**
 * Checks if the value of the refined number field is not set to Infinity.
 * If the value is Infinity, it raises a Zod "required" validation error with a custom message.
 *
 * @param fieldName - The name of the field being refined.
 * @returns A tuple containing the refine function and the required error message.
 */
export const z_notInfRefine = (fieldName: string) =>
  [
    (v: number) => v !== Infinity,
    { message: `${fieldName} is required` },
  ] as const;

/**
 * These fields are considered empty or uninitialized.
 */
export const EMPTY_FIELD_VALUES = [undefined, "", null, Infinity, NaN];

/**
 *
 * @description
 * [], {}, "", Infinity, null, undefined, NaN  ---> these fields are considered empty field
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNotEmpty = (v: any) => {
  if (Array.isArray(v)) return v.length !== 0;
  if (typeof v === "object") return Object.entries(v).length !== 0;
  return !EMPTY_FIELD_VALUES.includes(v);
};

/**
 *
 * @description
 * [], {}, "", Infinity, null, undefined, NaN  ---> these fields are considered empty field
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (v: any) => {
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.entries(v).length === 0;
  return EMPTY_FIELD_VALUES.includes(v);
};
