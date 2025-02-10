import React from "react";
import UpdateFormContainer from "./update-expense";

type Props = {
  params: Promise<{ expenseId: string }>;
};

async function EditExpense({ params }: Props) {
  const expenseId = (await params).expenseId;

  return (
    <div>
      <UpdateFormContainer expenseId={parseInt(expenseId)} />
    </div>
  );
}

export default EditExpense;
