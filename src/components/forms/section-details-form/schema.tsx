import { z } from "zod";
import { z_notInfRefine } from "../form-utils";

export const sectionCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Section name is required" })
    .max(32, { message: "Section name must be 32 characters or less" }),
  grade_id: z.number().refine(...z_notInfRefine("Grade")),
  class_teacher_id: z.number().nullable(),
});

export const sectionUpdateSchema = sectionCreateSchema;

export type ISectionUpdateFormData = z.infer<typeof sectionUpdateSchema>;
export type ISectionCreateFormData = z.infer<typeof sectionCreateSchema>;
