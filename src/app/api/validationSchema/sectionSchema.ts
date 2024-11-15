import { sectionCreateSchema } from "@/components/forms/section-details-form/schema";
import { z } from "zod";
import { prismaQ } from "../utils/prisma";

export const sectionCreateValidationSchema = sectionCreateSchema.superRefine(
  async (data, ctx) => {
    const section = await prismaQ.section.findUnique({
      where: {
        grade_id_name: {
          name: data.name,
          grade_id: data.grade_id,
        },
      },
    });

    if (section) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "Section name exists on the selected grade",
      });
    }
  }
);

export const sectionUpdateValidationSchema = sectionCreateSchema
  .extend({
    id: z.number(),
  })
  .superRefine(async (data, ctx) => {
    const section = await prismaQ.section.findUnique({
      where: {
        grade_id_name: {
          name: data.name,
          grade_id: data.grade_id,
        },
        NOT: {
          id: data.id,
        },
      },
    });

    if (section) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "Section name exists on the selected grade",
      });
    }
  });
