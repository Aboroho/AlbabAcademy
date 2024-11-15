import { cohortBaseSchema } from "@/components/forms/cohort-details-form/schema";
import { z } from "zod";
import { prismaQ } from "../utils/prisma";

export const cohortCreateValidationSchema = cohortBaseSchema.superRefine(
  async (data, ctx) => {
    const cohort = await prismaQ.cohort.findFirst({
      where: {
        name: data.name,
      },
    });

    if (cohort)
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "Cohort name must be unique",
      });
  }
);

export const cohortUpdateValidationSchema = cohortBaseSchema
  .extend({
    id: z.number(),
  })
  .superRefine(async (data, ctx) => {
    const cohort = await prismaQ.cohort.findFirst({
      where: {
        name: data.name,

        NOT: {
          id: data.id,
        },
      },
    });

    if (cohort)
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "Cohort name must be unique",
      });
  });
