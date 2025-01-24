import { attendanceBaseSchema } from "@/components/forms/attendance-form/schema";
import { z } from "zod";

export const attendanceValidationSchema = attendanceBaseSchema
  .omit({ date: true })
  .extend({
    date: z.string(),
  })
  .transform((data) => {
    return {
      ...data,
      date: new Date(data.date.split("T")[0]),
    };
  });
