import {
  studentBaseSchema,
  studentUpdateSchema,
} from "@/components/forms/student-details-form/schema";
import {
  userCreateValidationSchema,
  userUpdateValidationSchema,
} from "./userSchema";
import { prismaQ } from "../utils/prisma";
import { z } from "zod";
import { omitFields } from "../utils/excludeFields";
import { isEmpty, isNotEmpty } from "@/components/forms/form-utils";

export const studentCreateValidatoinSchema = studentBaseSchema
  .omit({ grade_id: true, section_id: true })
  .extend({
    user: userCreateValidationSchema,
  })
  .superRefine(async (data, ctx) => {
    if (isNotEmpty(data.payment_template_id) && isEmpty(data.payment_status))
      return ctx.addIssue({
        path: ["payment_status"],
        code: "custom",
        message: "Payment status required",
      });
    const student = await prismaQ.student.findUnique({
      where: {
        student_id: data.student_id,
      },
    });

    if (student)
      return ctx.addIssue({
        code: "custom",
        message: "Student id should be unique",
        path: ["student_id"],
      });

    const rollCohort = await prismaQ.student.findFirst({
      where: {
        roll: data.roll,
        cohort_id: data.cohort_id,
      },
    });

    if (rollCohort)
      ctx.addIssue({
        message: "Roll exists on this cohort",
        path: ["roll"],
        code: "custom",
      });
  });
export const studentUpdateValidationSchema = studentUpdateSchema
  .omit({ grade_id: true, section_id: true })
  .extend({
    user: userUpdateValidationSchema,
    id: z.number(),
  })
  .superRefine(async (data, ctx) => {
    const student = await prismaQ.student.findUnique({
      where: {
        student_id: data.student_id,
        NOT: {
          id: data.id,
        },
      },
    });

    if (student)
      ctx.addIssue({
        code: "custom",
        message: "Student id should be unique",
        path: ["student_id"],
      });

    const rollCohort = await prismaQ.student.findFirst({
      where: {
        roll: data.roll,
        cohort_id: data.cohort_id,
        NOT: {
          id: data.id,
        },
      },
    });

    if (rollCohort)
      ctx.addIssue({
        message: "Roll exists on this cohort",
        path: ["roll"],
        code: "custom",
      });
  })
  .transform((data) => omitFields(data, ["id"]));
