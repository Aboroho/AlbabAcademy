import { z } from "zod";

export const curriculumValidationSchema = z.object({
  description: z.string().min(3, "Description is required"),
  title: z.string().min(3, "Title is required"),
  image: z.string().url("Image must be a valid URL"),
});

export type CurriculumFormData = z.infer<typeof curriculumValidationSchema>;
