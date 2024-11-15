import { z } from "zod";

export const gradeCreateSchema = z.object({
  name: z
    .string()
    .max(32, { message: "Grade name must be 32 characters or less" })
    .min(1, { message: "Grade name is required" }),
});

export const gradeUpdateSchema = gradeCreateSchema;

export type IGradeUpdateFormData = z.infer<typeof gradeUpdateSchema>;
export type IGradeCreateFormData = z.infer<typeof gradeCreateSchema>;
