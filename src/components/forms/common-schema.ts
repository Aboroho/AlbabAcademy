import { z } from "zod";

export const RoleEnum = z.enum([
  "STUDENT",
  "TEACHER",
  "ADMIN",
  "STAFF",
  "SUPER_ADMIN",
]);

export const PaymentStatus = z.enum(["PROCESSING", "PAID", "FAILED"], {
  errorMap: () => ({
    message:
      "Invalid status. Accepted values are PROCESSING, COMPLETED, or FAILED.",
  }),
});

export const addressCreateSchema = z.object({
  district: z
    .string()
    .max(15, { message: "District must be 15 characters or less" })
    .optional()
    .nullable(),
  sub_district: z
    .string()

    .max(15, { message: "Sub-district must be 15 characters or less" })
    .optional()
    .nullable(),
  union: z
    .string()
    .max(15, { message: "Union must be 15 characters or less" })
    .optional()
    .nullable(),
  village: z
    .string()
    .max(15, { message: "Village must be 15 characters or less" })
    .optional()
    .nullable(),
});

export const addressUpdateSchema = addressCreateSchema.extend({});

export type IAddressCreateFormData = z.infer<typeof addressCreateSchema>;
export type IAddressUpdateFormData = z.infer<typeof addressUpdateSchema>;

// User validation schema
export const userCreateSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(12, { message: "Username cannot be longer than 12 characters" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" })
    .max(128, { message: "Password cannot be longer than 128 characters" }),

  phone: z
    .string()
    .max(14, { message: "Phone number must be exactly 14 characters" })
    .min(11, { message: "Phone number must be at least 11 characters" }),
  email: z.preprocess(
    (email) => email || null,
    z
      .string()
      .email({ message: "Type a valid email" })
      .max(32, "Email should not be more that 32 characters")
      .optional()
      .nullable()
  ),

  avatar: z.string().optional().nullable(),
});

export const userUpdateSchema = userCreateSchema.omit({ password: true });

export type IUserCreateFormData = z.infer<typeof userCreateSchema>;
export type IUserUpdateFormData = z.infer<typeof userUpdateSchema>;
