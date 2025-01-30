import { z } from "zod";

// Define the status enum
const AssesmentStatus = z.enum(
  ["PENDING", "IN_PROGRESS", "COMPLETED", "GRADED"],
  {
    errorMap: () => ({
      message:
        'Status must be one of  "PENDING", "IN_PROGRESS", "COMPLETED", "GRADED" ',
    }),
  }
);
export const assessmentSubjectSchema = z.object({
  // assessment_id: z
  //   .number({
  //     required_error: "Assessment ID is required.",
  //     invalid_type_error: "Assessment ID must be a number.",
  //   })
  //   .int("Assessment ID must be an integer.")
  //   .positive("Assessment ID must be a positive integer.")
  //   .optional(),

  subject_name: z
    .string({
      required_error: "Subject name is required.",
      invalid_type_error: "Subject name must be a string.",
    })
    .min(1, "Subject name cannot be empty.")
    .max(32, "Subject name must not exceed 32 characters."),

  total_marks: z
    .number({
      required_error: "Total mark is required.",
      invalid_type_error: "Total mark must be a number.",
    })
    .int("Total mark must be an integer.")
    .positive("Total mark must be a positive integer."),

  teacher_id: z
    .number({
      invalid_type_error: "Teacher ID must be a number.",
    })
    .int("Teacher ID must be an integer.")
    .positive("Teacher ID must be a positive integer.")
    .optional(),
});

export const AssessmentSchema = z.object({
  grade_id: z
    .number({
      required_error: "Grade ID is required.",
      invalid_type_error: "Grade ID must be a number.",
    })
    .int("Grade ID must be an integer.")
    .positive("Grade ID must be a positive integer."),
  section_ids: z
    .array(
      z
        .number()
        .int("Grade ID must be an integer.")
        .positive("Grade ID must be a positive integer.")
    )
    .min(1, "Sections are required"),

  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title must be a string.",
    })
    .min(1, "Title cannot be empty.")
    .max(128, "Title must not exceed 128 characters."),

  description: z
    .string({
      invalid_type_error: "Description must be a string.",
    })
    .max(512, "Description must not exceed 512 characters.")
    .optional(),

  assessment_type: z
    .string({
      invalid_type_error: "Assessment type must be a string.",
    })
    .min(1, "Assessment type cannot be empty.")
    .max(20, "Assessment type must not exceed 20 characters."),
  date: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg;
  }, z.date({ message: "Invalid date" })),

  status: AssesmentStatus.default("IN_PROGRESS"),
  assessment_subjects: z.array(assessmentSubjectSchema),
});
