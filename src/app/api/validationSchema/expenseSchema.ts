import { z } from "zod";

export const expenseValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().min(1, "Amount is required"),
  description: z.string().optional(),
  date: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg;
  }, z.union([z.date({ message: "Invalid date" }), z.string()])),
});
