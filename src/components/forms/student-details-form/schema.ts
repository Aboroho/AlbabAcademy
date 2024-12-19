import { z } from "zod";
import {
  addressCreateSchema,
  PaymentStatus,
  userCreateSchema,
  userUpdateSchema,
} from "../common-schema";
import { isEmpty, isNotEmpty, z_notInfRefine } from "../form-utils";

export const GenderEnum = z.enum(["MALE", "FEMALE"], {
  errorMap: () => ({ message: "Gender must be one of MALE, FEMALE, or OTHER" }),
});

export const ResidentialStatusEnum = z.enum(
  ["RESIDENTIAL", "NON_RESIDENTIAL"],
  {
    errorMap: () => ({
      message:
        "Residential status must be one of RESIDENTIAL, or NON_RESIDENTIAL",
    }),
  }
);

export const studentBaseSchema = z.object({
  user: userCreateSchema,
  address: addressCreateSchema,

  student_id: z
    .string()
    .min(1, { message: "Student ID is required" })
    .max(12, { message: "Student ID must be 12 characters or fewer" }),
  grade_id: z
    .number({ message: "Grade is required" })
    .refine(...z_notInfRefine("Grade")),
  section_id: z
    .number({ message: "Section is required" })
    .refine(...z_notInfRefine("Section")),
  cohort_id: z
    .number({ message: "Cohort is required" })
    .refine(...z_notInfRefine("Cohort")),
  roll: z
    .number({ message: "Roll is required" })
    .refine(...z_notInfRefine("Roll")),
  full_name: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(32, { message: "Full name must be 32 characters or fewer" }),
  father_name: z
    .string()
    .min(1, { message: "Father's name is required" })
    .max(32, { message: "Father's name must be 32 characters or fewer" }),
  mother_name: z
    .string()
    .min(1, { message: "Mother's name is required" })
    .max(32, { message: "Mother's name must be 32 characters or fewer" }),
  gender: GenderEnum,

  guardian_phone: z.preprocess(
    (phone) => (isEmpty(phone) ? undefined : phone),
    z
      .string()
      .regex(/^\d+$/g, "Invalid phone number")
      .length(11, { message: "Phone number must be exactly 11 digits" })

      .optional()
      .nullable()
  ),
  date_of_birth: z.preprocess(
    (arg) => {
      return typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : arg;
    },
    z.union([
      z.date({ message: "Invalid date" }).refine((date) => date <= new Date(), {
        message: "Date of birth must be in the past",
      }),
      z.string(),
    ])
  ),
  residential_status: ResidentialStatusEnum.default("NON_RESIDENTIAL"),

  // optional at create time
  payment_template_id: z.number().optional(),
  payment_status: PaymentStatus.optional(),
});

export const studentCreateSchema = studentBaseSchema.superRefine(
  (data, ctx) => {
    if (isNotEmpty(data.payment_template_id) && isEmpty(data.payment_status))
      ctx.addIssue({
        path: ["payment_status"],
        code: "custom",
        message: "Payment status required",
      });
  }
);

export const studentUpdateSchema = studentBaseSchema
  .omit({ payment_template_id: true, payment_status: true })
  .extend({
    user: userUpdateSchema,
  });

export type IStudentUpdateFormData = z.infer<typeof studentUpdateSchema>;
export type IStudentCreateFormData = z.infer<typeof studentCreateSchema>;
