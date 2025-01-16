import { z } from "zod";

export const NoticeTarget = z.enum(
  [
    "ALL_USERS",
    "STUDENT",
    "TEACHER",
    "STAFF",
    "DIRECTOR",
    "SUPER_ADMIN",
    "SPECIFIC_USER",
    "ADMIN",
  ],
  {
    errorMap: () => ({
      message:
        "Expected value : 'ALL_USERS', 'STUDENTS', 'TEACHERS', 'STAFF', 'DIRECTORS', 'SUPER_ADMINS', 'SPECIFIC_USER', 'ADMIN'",
    }),
  }
);

export const NoticeType = z.enum(["PUBLIC", "PRIVATE"], {
  errorMap: () => ({
    message: "Expected value - 'PUBLIC', 'PRIVATE'",
  }),
});

export const NoticeCategory = z.enum(
  [
    "RECRUITMENT",
    "ADMISSION",
    "ANNOUNCEMENT",
    "STUDENT_NOTICE",
    "TEACHER_NOTICE",
    "GENERAL",
  ],
  {
    errorMap: () => ({
      message:
        "Expected value : 'RECRUITMENT', 'ADMISSION', 'ANNOUNCEMENT', 'STUDENT_NOTICE', 'TEACHER_NOTICE', 'GENERAL'",
    }),
  }
);

export const noticeCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(256, "Title is too large"),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(10000, "Description is too large"),

  notice_target: NoticeTarget,
  notice_type: NoticeType,
  notice_category: NoticeCategory,
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"], {
    errorMap: () => ({
      message: "Expected value : 'ACTIVE', 'INACTIVE', ARCHIVED",
    }),
  }),
  attachments: z.array(
    z.object({
      name: z.string().max(60, "Too Long").min(2, "Too short"),
      url: z.string().url(),
      loaded: z.number().default(100).optional(),
    })
  ),
});

export const noticeUpdateSchema = noticeCreateSchema;

export type NoticeCreateFormData = z.infer<typeof noticeCreateSchema>;
export type NoticeUpdateFormData = z.infer<typeof noticeUpdateSchema>;
