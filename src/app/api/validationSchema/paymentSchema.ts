import {
  paymentTemplateCreateSchema,
  paymentTemplateUpdateSchema,
} from "@/components/forms/payment-template-form/schema";
import { z } from "zod";
import { prismaQ } from "../utils/prisma";
import {
  paymentRequestCreateSchema,
  paymentRequestUpdateSchema,
} from "@/components/forms/payment-request-form/schema";
import { PaymentStatus } from "@/components/forms/common-schema";

// Enums for PaymentStatus and PaymentMethod

const PaymentMethod = z.enum(["ONLINE", "CASH"], {
  errorMap: () => ({
    message: "Invalid payment method. Accepted values are ONLINE or CASH.",
  }),
});

export const PaymentTargetTypes = z.enum(
  ["STUDENT", "TEACHER", "GRADE", "SECTION", "COHORT"],
  {
    errorMap: () => ({
      message:
        "Expected value - 'STUDENT', 'TEACHER', 'GRADE', 'SECTION', 'COHORT'",
    }),
  }
);

// PaymentTemplate schema
export const paymentTemplateCreateValidationSchema =
  paymentTemplateCreateSchema.superRefine(async (data, ctx) => {
    const template = await prismaQ.paymentTemplate.findUnique({
      where: {
        name: data.name,
      },
    });
    if (template)
      ctx.addIssue({
        path: ["name"],
        message: "Payment template name must be unique",
        code: "custom",
      });
  });

export const paymentTemplateUpdateValidationSchema = paymentTemplateUpdateSchema
  .extend({
    id: z.number(),
  })
  .superRefine(async (data, ctx) => {
    const template = await prismaQ.paymentTemplate.findUnique({
      where: {
        name: data.name,
        NOT: {
          id: data.id,
        },
      },
    });
    if (template)
      ctx.addIssue({
        path: ["name"],
        message: "Payment template name must be unique",
        code: "custom",
      });
  });

// PaymentRequest schema
export const paymentRequestCreateValidationSchema =
  paymentRequestCreateSchema.omit({ payment_template_id: true });
export const paymentRequestUpdateValidationSchema = paymentRequestUpdateSchema;

// Payment schema
export const paymentValidationSchema = z.object({
  status: PaymentStatus,
  paymentMethod: PaymentMethod,
  user_id: z.number().min(1, { message: "User ID is required" }),
  payment_request_id: z
    .number()
    .min(1, { message: "Payment request ID is required" }),
});
