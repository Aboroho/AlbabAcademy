import {
  userCreateValidationSchema,
  userUpdateValidationSchema,
} from "./userSchema";

import {
  teacherCreateSchema,
  teacherUpdateSchema,
} from "@/components/forms/teacher-details-form/schema";

export const teacherCreateValidationSchema = teacherCreateSchema.extend({
  user: userCreateValidationSchema,
});
export const teacherUpdateValidationSchema = teacherUpdateSchema.extend({
  user: userUpdateValidationSchema,
});
