import {
  gradeCreateSchema,
  gradeUpdateSchema,
} from "@/components/forms/grade-details-form/schema";
import { z } from "zod";
import { prismaQ } from "../utils/prisma";
import { omitFields } from "../utils/excludeFields";

export const gradeCreateValidationSchema = gradeCreateSchema.superRefine(
  async (data, ctx) => {
    const grade = await prismaQ.grade.findUnique({
      where: {
        name: data.name,
      },
    });
    if (grade)
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Grade name exists",
      });
  }
);

export const gradeUpdateValidationSchema = gradeUpdateSchema
  .extend({
    // for unique update validation
    id: z.number(),
  })
  .superRefine(async (data, ctx) => {
    const grade = await prismaQ.grade.findUnique({
      where: {
        name: data.name,
        NOT: { id: data.id },
      },
    });

    if (grade)
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Grade name exists",
      });
  })
  .transform((data) => omitFields(data, ["id"]));
