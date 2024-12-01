import { z } from "zod";
import {
  addressCreateSchema,
  userCreateSchema,
  userUpdateSchema,
} from "../common-schema";

export const teacherCreateSchema = z.object({
  user: userCreateSchema,
  full_name: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(32, { message: "Full name must be 32 characters or less" }),
  designation: z
    .string()
    .min(1, { message: "Designation is required" })
    .max(32, { message: "Designation must be 32 characters or less" }),
  description: z
    .string()
    .max(1024, { message: "Description must be 1024 characters or less" })
    .optional()
    .nullable(),
  subject_expertise: z
    .string()
    .max(128, { message: "Subject expertise must be 128 characters or less" })
    .optional()
    .nullable(),
  date_of_joining: z
    .union([z.string().optional(), z.date().optional()])
    .optional()
    .nullable(),
  qualification: z
    .string()
    .max(128, { message: "Qualification must be 128 characters or less" })
    .optional()
    .nullable(),
  address: addressCreateSchema.optional(),
});

export const teacherUpdateSchema = teacherCreateSchema.extend({
  user: userUpdateSchema,
});

export type ITeacherCreateFormData = z.infer<typeof teacherCreateSchema>;
export type ITeacherUpdateFormData = z.infer<typeof teacherUpdateSchema>;
