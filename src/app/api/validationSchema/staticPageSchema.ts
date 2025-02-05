import { z } from "zod";

export const staticPageValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});
