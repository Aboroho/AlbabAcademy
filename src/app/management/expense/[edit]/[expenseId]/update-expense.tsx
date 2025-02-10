"use client";

import { useGetExpenseById } from "@/client-actions/queries/expense-queries";

import { Button } from "@/components/button";

import ExpenseDetailsForm from "@/components/forms/expense-details-form";

import React from "react";

type Props = {
  expenseId: number;
};

function UpdateFormContainer({ expenseId }: Props) {
  const { data: expense, isLoading } = useGetExpenseById(expenseId);

  return (
    <div>
      <ExpenseDetailsForm
        updateId={expenseId}
        defaultData={expense}
        isLoading={isLoading}
        updateEnabled={true}
        renderButton={(isSubmitting) => {
          return (
            <Button type="submit" disabled={isSubmitting}>
              Update Testimonial
            </Button>
          );
        }}
      />
    </div>
  );
}

export default UpdateFormContainer;
