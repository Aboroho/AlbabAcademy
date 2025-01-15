import { noticeCreateSchema } from "@/components/forms/notice-form/schema";

export const noticeCreateValidationSchema = noticeCreateSchema.transform(
  (data) => {
    return {
      ...data,
      attachments: JSON.stringify(data.attachments),
    };
  }
);
export const noticeUpdateValidationSchema = noticeCreateValidationSchema;
