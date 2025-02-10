"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import InputField from "@/components/ui/input-field";
import { ApiResponse, FormDetailsProps } from "@/types/common";
import { Button } from "@/components/button";

import {
  FormSection,
  isEmpty,
  isNotEmpty,
  noRecordFoundFallback,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
} from "../form-utils";

import { useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Expense } from "@prisma/client";
import { api } from "@/client-actions/helper";
import InputTextArea from "@/components/ui/input-textarea";

import toast from "react-hot-toast";
import { expenseDetailsFormSchema, ExpenseFormData } from "./schema";

import { DatePicker } from "@/components/ui/date-picker";

type FormData = ExpenseFormData;

function ExpenseDetailsForm({
  renderButton,
  updateId: expenseId,
  defaultData: expense,
  formTitle,
  isLoading,
  updateEnabled,
}: FormDetailsProps<Expense, FormData>) {
  const schema = expenseDetailsFormSchema;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      amount: 0,
      description: "",
      date: new Date(),
    },
  });

  const reset = form.reset;
  const errors = form.formState.errors;

  useEffect(() => {
    if (expense && isNotEmpty(expense)) {
      console.log(expense);
      reset({
        title: expense.title,
        amount: expense.amount,
        description: expense.description || "",
        date: expense.date,
      });
    }
  }, [reset, expense]);

  // mutations
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      console.log(data);
      return await api("/expense/" + expenseId, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api("/expense/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      toast.loading("Updating expense...", { id: "expense-update" });
      res = await updateMutation.mutateAsync(data);
      toast.dismiss("expense-update");
      if (res.success) {
        toast.success("expense updated successfully");
      } else {
        toast.error("Error updating expense");
      }
    } else {
      toast.loading("Creating expense...", { id: "expense-create" });
      res = await createMutation.mutateAsync(data);
      toast.dismiss("expense-create");
      if (res.success) {
        toast.success("expense created successfully");
        reset();
      } else {
        toast.error("Error creating expense");
      }
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(expenseId) || isEmpty(expense)))
    return noRecordFoundFallback();

  return (
    <div>
      {/* Form Title section */}
      <div>
        <h1 className="text-2xl mb-10 ">
          {formTitle || "Expense Details Form"}
        </h1>
      </div>

      {/* Error Area */}
      {isNotEmpty(errors) && (
        <div className="p-4 rounded-md bg-red-100 mb-6 text-red-500">
          {showErrors(errors as { [key: string]: { message: string } })}
        </div>
      )}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="personal-details p-2 space-y-4">
              <FormSection title="Expense Details">
                <InputField
                  label="Expense Title"
                  placeholder="e.g., Salary"
                  {...form.register("title")}
                  error={errors.title}
                />
                <InputField
                  label="Expense Amount"
                  placeholder="e.g., 5000"
                  {...form.register("amount", {
                    valueAsNumber: true,
                  })}
                  error={errors.amount}
                />
                <DatePicker
                  className="max-w-[350px] w-full"
                  defaultDate={new Date(form.watch("date"))}
                  onSelect={(date) => {
                    form.setValue("date", date);
                  }}
                />
                <InputTextArea
                  label="Expense Details (optional)"
                  {...form.register("description")}
                  error={errors.description}
                />
              </FormSection>
              <div className="mt-auto">
                {renderButton ? (
                  renderButton(
                    form.formState.isSubmitting ||
                      updateMutation.isPending ||
                      createMutation.isPending
                  )
                ) : (
                  <Button
                    isLoading={form.formState.isSubmitting}
                    type="submit"
                    className="mt-auto"
                    disabled={
                      form.formState.isSubmitting ||
                      updateMutation.isPending ||
                      createMutation.isPending
                    }
                  >
                    Submit Data
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default ExpenseDetailsForm;
