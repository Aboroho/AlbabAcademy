import { z } from "zod";

export const optionalAddressSchema = z.object({
  district: z
    .string()

    .max(15, { message: "District must be 15 characters or less" })
    .optional(),
  sub_district: z
    .string()

    .max(15, { message: "Sub-district must be 15 characters or less" })
    .optional(),
  union: z
    .string()

    .max(15, { message: "Union must be 15 characters or less" })
    .optional(),
  village: z
    .string()
    .max(15, { message: "Village must be 15 characters or less" })
    .optional(),
});
export const addressSchema = z.object({
  district: z
    .string()
    .min(1, { message: "District is required" })
    .max(15, { message: "District must be 15 characters or less" }),
  sub_district: z
    .string()
    .min(1, { message: "Sub-district is required" })
    .max(15, { message: "Sub-district must be 15 characters or less" }),
  union: z
    .string()
    .min(1, { message: "Union is required" })
    .max(15, { message: "Union must be 15 characters or less" }),
  village: z
    .string()
    .max(15, { message: "Village must be 15 characters or less" })
    .optional(),
});
