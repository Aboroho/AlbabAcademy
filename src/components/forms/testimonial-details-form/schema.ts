import { z } from "zod";

export const testimonialValidationSchema = z.object({
  name: z.string().min(3, "Name is required"),
  designation: z.string().min(3, "Designation is required"),
  message: z.string().min(3, "Message is required"),
  avatar: z.string().url("Avatar must be a valid URL"),
});

export type TestimonialFormData = z.infer<typeof testimonialValidationSchema>;
