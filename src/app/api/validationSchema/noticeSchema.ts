import { noticeCreateSchema } from "@/components/forms/notice-form/schema";

export const noticeCreateValidationSchema = noticeCreateSchema.transform(
  (data) => {
    return {
      ...data,
      attachments: JSON.stringify(
        data.attachments.map((item) => ({
          name: item.name,
          url: item.url,
        }))
      ),
    };
  }
);
export const noticeUpdateValidationSchema = noticeCreateValidationSchema;
