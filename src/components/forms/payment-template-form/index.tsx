import { ApiResponse, FormDetailsProps } from "@/types/common";
import React, { useEffect } from "react";
import {
  IPaymentTemplateCreateFormData,
  IPaymentTemplateUpdateFormData,
  paymentTemplateCreateSchema,
  paymentTemplateUpdateSchema,
} from "./schema";
import { useFieldArray, useForm } from "react-hook-form";
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

import { Button } from "@/components/button";
import { LayoutTemplate, PlusIcon, ReceiptText } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";

import { IPaymentTemplateResponse } from "@/types/response_types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentTemplate, updatePaymentTemplate } from "./utils";

type FormData = IPaymentTemplateCreateFormData | IPaymentTemplateUpdateFormData;
function PaymentTemplateDetailsForm({
  renderButton,
  defaultData: paymentTemplate,
  updateEnabled,
  updateId: paymentTemplateId,
  isLoading,
  formTitle,
}: FormDetailsProps<IPaymentTemplateResponse, FormData>) {
  const schema = updateEnabled
    ? paymentTemplateUpdateSchema
    : paymentTemplateCreateSchema;
  const form = useForm<FormData>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      template_fields: [{ amount: 0, description: "" }],
    },
  });

  const { prepend, fields, remove } = useFieldArray({
    control: form.control,
    name: "template_fields",
  });

  function addNewField() {
    prepend({ amount: 0, description: "" });
  }

  const reset = form.reset;
  const errors = form.formState.errors;

  useEffect(() => {
    if (isNotEmpty(paymentTemplate) && paymentTemplate) {
      reset({
        name: paymentTemplate.name,
        description: paymentTemplate.description,
        template_fields: paymentTemplate.template_fields.map((f) => ({
          amount: f.amount,
          description: f.description,
        })),
      });
    }
  }, [paymentTemplate, reset]);

  // mutation
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: IPaymentTemplateUpdateFormData) => {
      return await updatePaymentTemplate(data, paymentTemplateId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-templates"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: IPaymentTemplateUpdateFormData) => {
      return await createPaymentTemplate(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-templates"] });
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(
        data as IPaymentTemplateCreateFormData
      );
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(paymentTemplateId) || isEmpty(paymentTemplate)))
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
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="">
            <FormSection title="Payment template info">
              <InputField
                icon={<LayoutTemplate className="w-4 h-4" />}
                placeholder="Unique name for the template"
                {...form.register("name")}
                label="Template Name"
                error={errors.name}
              />
              <InputField
                {...form.register("description")}
                icon={<ReceiptText className="w-4 h-4" />}
                label="Template Description (optional)"
                placeholder="Description of the template"
                error={errors.description}
              />
            </FormSection>
          </div>
          <div>
            <FormSection title="Template Fields">
              <Button
                size="sm"
                onClick={addNewField}
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
                    label="Payment Details"
                    placeholder="e.g., Tuition fee, Admission Fees"
                    {...form.register(`template_fields.${index}.description`)}
                    error={errors.template_fields?.[index]?.description}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.setFocus(`template_fields.${index}.amount`);
                      }
                    }}
                  />
                  <InputField
                    type="number"
                    error={errors.template_fields?.[index]?.amount}
                    label="Amount"
                    {...form.register(`template_fields.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNewField();
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
            </FormSection>
          </div>
          <div className="mt-5 ">
            {renderButton ? (
              renderButton(form.formState.isSubmitting)
            ) : (
              <Button type="submit">Submit Payment Template Info</Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PaymentTemplateDetailsForm;
