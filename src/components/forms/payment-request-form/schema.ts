import { z } from "zod";

export const PaymentTargetTypes = z.enum(
  ["STUDENT", "TEACHER", "GRADE", "SECTION", "COHORT"],
  {
    errorMap: () => ({
      message:
        "Expected value - 'STUDENT', 'TEACHER', 'GRADE', 'SECTION', 'COHORT'",
    }),
  }
);

export const paymentRequestCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(256, "Title is too large"),
  description: z.string().optional().nullable(),
  forMonth: z
    .string()
    .max(15, { message: "Month must be between 1 and 12" })
    .optional()
    .nullable(),
  forYear: z.string().optional().nullable(),
  payment_template_id: z
    .number({ message: "Payment template required" })
    .optional()
    .nullable(),
  payment_details: z.array(
    z.object({
      details: z.string().min(1, "Details Required"),
      amount: z.number(),
    })
  ),
  stipend: z.number().default(0),
  payment_target_type: PaymentTargetTypes,
  payment_targets: z.array(z.number()).min(1, "Target is required"),
});

export const paymentRequestUpdateSchema = paymentRequestCreateSchema.omit({
  payment_template_id: true,
  payment_target_type: true,
  payment_targets: true,
});

export type IPaymentRequestCreateFormData = z.infer<
  typeof paymentRequestCreateSchema
>;
export type IPaymentRequestUpdateFormData = z.infer<
  typeof paymentRequestUpdateSchema
>;
