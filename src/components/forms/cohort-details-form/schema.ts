import { z } from "zod";
import { z_notInfRefine } from "../form-utils";
import { omitFields } from "@/app/api/utils/excludeFields";

const CohortStatusEnum = z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"], {
  errorMap: () => ({
    message: "Status must be one of ACTIVE, INACTIVE, or ARCHIVED",
  }),
});

export const cohortBaseSchema = z.object({
  name: z
    .string()
    .max(32, { message: "Cohort name must be 32 characters or less" })
    .min(1, { message: "Cohort name is required" }),
  description: z
    .string()
    .max(256, { message: "Description must be 256 characters or less" })
    .optional()
    .nullable(),
  section_id: z.number().refine(...z_notInfRefine("Section")),
  status: CohortStatusEnum.default("ACTIVE"),
});

export const cohortCreateSchema = z
  .object({
    name: z
      .string()
      .max(32, { message: "Cohort name must be 32 characters or less" })
      .min(1, { message: "Cohort name is required" }),
    description: z
      .string()
      .max(256, { message: "Description must be 256 characters or less" })
      .optional()
      .nullable(),
    section_id: z.number().refine(...z_notInfRefine("Section")),
    grade_id: z.number().refine(...z_notInfRefine("Grade")),
    status: CohortStatusEnum.default("ACTIVE"),
  })
  .transform((data) => omitFields(data, ["grade_id"]));

export const cohortUpdateSchema = cohortCreateSchema;

export type ICohortUpdateFormData = z.infer<typeof cohortUpdateSchema>;
export type ICohortCreateFormData = z.infer<typeof cohortCreateSchema>;
