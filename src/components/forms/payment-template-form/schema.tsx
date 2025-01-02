import { z } from "zod";

// PaymentTemplateField schema
export const paymentTemplateFieldSchema = z.object({
  description: z
    .string()
    .min(1, "Payment details is required")
    .max(128, "Payment details can not exceed 128 characters"),
  amount: z.number().min(0, { message: "Amount must be a positive number" }),
});

// PaymentTemplate schema
export const paymentTemplateCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Template name is required" })
    .max(256, { message: "Templat name cannot exceed 30 characters" }),
  description: z
    .string()
    .max(1024, "Template description is too large")
    .optional()
    .nullable(),
  template_fields: z
    .array(paymentTemplateFieldSchema, {
      message: "Template fields are required",
    })
    .min(1, "At least one field is required"),
});

export const paymentTemplateUpdateSchema = paymentTemplateCreateSchema;

export type IPaymentTemplateCreateFormData = z.infer<
  typeof paymentTemplateCreateSchema
>;
export type IPaymentTemplateUpdateFormData = z.infer<
  typeof paymentTemplateUpdateSchema
>;
