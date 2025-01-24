import { z } from "zod";

export const attendanceBaseSchema = z.object({
  date: z.date({ message: "Choose a valid date" }),
  data: z.array(
    z.object({
      student_id: z.number({ message: "Student ID is required" }),
      status: z.enum(["PRESENT", "ABSENT", "NO_DATA"], {
        message: "Status must be one of PRESENT, ABSENT or NO_DATA",
      }),
    })
  ),
});
export type AttendanceBaseFormData = z.infer<typeof attendanceBaseSchema>;
