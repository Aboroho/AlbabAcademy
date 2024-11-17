"use client";
import { ApiResponse, FormDetailsProps } from "@/types/common";
import React, { useEffect } from "react";
import {
  IPaymentRequestCreateFormData,
  IPaymentRequestUpdateFormData,
  paymentRequestCreateSchema,
  paymentRequestUpdateSchema,
} from "./schema";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormSection,
  isEmpty,
  isNotEmpty,
  noRecordFoundFallback,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
} from "../form-utils";

import InputField from "@/components/ui/input-field";
import { SelectInput } from "@/components/ui/single-select-input";
import { useGetPaymentTemplates } from "@/client-actions/queries/payment-queries";
import { Button } from "@/components/button";
import {
  SelectMonth,
  SelectPaymentTarget,
  SelectPaymentTargetTypes,
  SelectYear,
} from "../common-fields";
import { IPaymentRequestResponse } from "@/types/response_types";
import { useMutation } from "@tanstack/react-query";

import { createPaymentRequest, updatePaymentRequest } from "./utils";

type FormData = IPaymentRequestCreateFormData;
function PaymentRequestForm({
  renderButton,
  defaultData: paymentRequest,
  updateId: paymentRequestId,
  formTitle,
  isLoading,
  updateEnabled,
}: FormDetailsProps<IPaymentRequestResponse, FormData>) {
  const schema = updateEnabled
    ? paymentRequestUpdateSchema
    : paymentRequestCreateSchema;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      forMonth: "",
      forYear: "",
      payment_target_type: undefined,
      payment_targets: [],
      payment_template_id: Infinity,
      title: "",
    },
  });
  const errors = form.formState.errors;
  const reset = form.reset;
  const paymentTemplateId = form.watch("payment_template_id");
  const { data: paymentTemplates } = useGetPaymentTemplates();

  useEffect(() => {
    if (isNotEmpty(paymentRequest) && paymentRequest) {
      reset({
        title: paymentRequest.title,
        description: paymentRequest.description,
        forMonth: paymentRequest.forMonth,
        forYear: paymentRequest.forYear,
      });
    }
  }, [paymentRequest, reset]);

  // mutation
  const updateMutation = useMutation({
    mutationFn: async (data: IPaymentRequestUpdateFormData) => {
      return await updatePaymentRequest(data, paymentTemplateId);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: IPaymentRequestCreateFormData) => {
      return await createPaymentRequest(data);
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(
        data as IPaymentRequestCreateFormData
      );
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(paymentRequestId) || isEmpty(paymentRequest)))
    return noRecordFoundFallback();

  return (
    <div>
      {/* Form Title section */}
      <div>
        <h1 className="text-2xl mb-10 ">{formTitle || "Payment Template"}</h1>
      </div>

      {/* Error Area */}
      {isNotEmpty(errors) && (
        <div className="p-4 rounded-md bg-red-100 mb-6 text-red-500">
          {showErrors(errors as { [key: string]: { message: string } })}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection title="Payment request info">
          <InputField
            label="Title"
            {...form.register("title")}
            error={errors.title}
          />
          <InputField
            label="Description (optional)"
            {...form.register("description")}
            error={errors.description}
          />
          <div className="flex gap-4">
            <Controller
              control={form.control}
              name="forMonth"
              render={({ field }) => (
                <SelectMonth
                  {...field}
                  selectedValue={form.watch("forMonth") as string}
                  label="For Month (optional)"
                  onSelect={(selectedMonth) => field.onChange(selectedMonth)}
                  error={errors.forMonth}
                  placeholder="Select month"
                />
              )}
            />

            <Controller
              control={form.control}
              name="forYear"
              render={({ field }) => (
                <SelectYear
                  {...field}
                  selectedValue={form.watch("forYear") as string}
                  label="For Year (optional)"
                  onSelect={(selectedYear) => field.onChange(selectedYear)}
                  error={errors.forYear}
                  placeholder="Select year"
                />
              )}
            />
          </div>

          {!updateEnabled && (
            <Controller
              control={form.control}
              name="payment_template_id"
              render={({ field }) => (
                <SelectInput
                  label="Payment Template"
                  placeholder="choose a template"
                  selectedValue={paymentTemplateId?.toString()}
                  options={paymentTemplates?.map((template) => ({
                    label: template.name,
                    value: template.id.toString(),
                  }))}
                  onSelect={(selectedTemplateId) => {
                    if (selectedTemplateId)
                      field.onChange(parseInt(selectedTemplateId));
                    else field.onChange(undefined);
                  }}
                  error={errors.payment_template_id}
                />
              )}
            />
          )}

          {!updateEnabled && (
            <>
              <Controller
                control={form.control}
                name="payment_target_type"
                render={({ field }) => (
                  <SelectPaymentTargetTypes
                    {...field}
                    selectedValue={form.watch("payment_target_type")}
                    label="Payment Target Type"
                    onSelect={(selectedType) => field.onChange(selectedType)}
                    error={errors.payment_target_type}
                    placeholder="Select target type"
                  />
                )}
              />
              <FormProvider {...form}>
                <SelectPaymentTarget
                  targetType={form.watch("payment_target_type")}
                />
              </FormProvider>
              <div className="!mt-10 text-right">
                {renderButton ? (
                  renderButton(form.formState.isSubmitting)
                ) : (
                  <Button type="submit">Create Request</Button>
                )}
              </div>
            </>
          )}
        </FormSection>
      </form>
    </div>
  );
}

export default PaymentRequestForm;
