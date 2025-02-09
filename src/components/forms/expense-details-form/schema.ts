import { z } from "zod";

export const expenseDetailsFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().min(1, "Amount is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

export type ExpenseFormData = z.infer<typeof expenseDetailsFormSchema>;
