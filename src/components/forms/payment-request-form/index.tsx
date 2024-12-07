"use client";
import { ApiResponse, FormDetailsProps } from "@/types/common";
import React, { useEffect } from "react";
import {
  IPaymentRequestCreateFormData,
  IPaymentRequestUpdateFormData,
  paymentRequestCreateSchema,
  paymentRequestUpdateSchema,
} from "./schema";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
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
import { PlusIcon } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";

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
      payment_details: [],
      stipend: 0,
    },
  });
  const errors = form.formState.errors;
  const reset = form.reset;
  const paymentTemplateId = form.watch("payment_template_id");
  const { data: paymentTemplates } = useGetPaymentTemplates();

  const { prepend, fields, remove } = useFieldArray({
    control: form.control,
    name: "payment_details",
  });

  useEffect(() => {
    const paymentTemplate = paymentTemplates?.find(
      (template) => template.id === paymentTemplateId
    );
    if (!paymentTemplate) return;
    paymentTemplate.template_fields.map((fields) => {
      prepend({ details: fields.description, amount: fields.amount });
    });
  }, [paymentTemplateId, paymentTemplates, prepend]);

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
    console.log(data);
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

  const totalAmount = form
    .watch("payment_details")
    ?.reduce((sum, cur) => sum + cur.amount, 0);

  const stipend = form.watch("stipend");
  const payableAmount = Math.max(0, totalAmount - stipend);

  if (stipend > payableAmount && !form.formState.errors.stipend) {
    form.setError(
      "stipend",
      {
        message: "Stipend must be less than or equal to the total amount",
        type: "custom",
      },
      { shouldFocus: true }
    );
  }

  if (
    stipend <= payableAmount &&
    form.formState.errors.stipend?.type === "custom"
  ) {
    form.clearErrors("stipend");
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
            <FormSection title="Payment Fields">
              <Button
                size="sm"
                onClick={() => prepend({ details: "", amount: 0 })}
                className="mb-4 bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="w-3 h-3" />
                Add New Field
              </Button>

              {fields.map((field, index) => (
                <div
                  className="flex gap-2 flex-nowrap items-start"
                  key={field.id}
                >
                  <InputField
                    label="Description"
                    {...form.register(`payment_details.${index}.details`)}
                    error={errors.payment_details?.[index]?.details}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.setFocus(`payment_details.${index}.amount`);
                      }
                    }}
                  />
                  <InputField
                    type="number"
                    error={errors.payment_details?.[index]?.amount}
                    label="Amount"
                    {...form.register(`payment_details.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        prepend({ details: "", amount: 0 });
                      }
                    }}
                    rightIcon={
                      <Cross1Icon
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => remove(index)}
                      />
                    }
                  />
                </div>
              ))}

              <div className="text-right font-bold">
                Total Amount: {totalAmount} ৳
              </div>
              <div className="text-right font-bold">
                Stipend: {stipend || 0} ৳
              </div>
              <div className="text-right font-bold">
                Payable amount: {payableAmount} ৳
              </div>
            </FormSection>
          )}

          {!updateEnabled && (
            <Controller
              control={form.control}
              name="stipend"
              render={({ field }) => (
                <InputField
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value));
                  }}
                  label="Stipend (Taka)"
                  error={errors.stipend}
                  type="number"
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
