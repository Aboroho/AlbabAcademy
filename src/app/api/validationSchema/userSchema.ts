import {
  IUserCreateFormData,
  IUserUpdateFormData,
  userCreateSchema,
  userUpdateSchema,
} from "@/components/forms/common-schema";
import { hashPassword } from "../utils/encryption";
import { prismaQ } from "../utils/prisma";
import { z } from "zod";
import { omitFields } from "../utils/excludeFields";

async function refineUser<T extends IUserCreateFormData | IUserUpdateFormData>(
  data: T,
  ctx: z.RefinementCtx,
  updateId?: number
) {
  console.log(data.phone);
  const user = await prismaQ.user.findFirst({
    where: {
      AND: [
        {
          OR: [
            {
              username: data.username,
            },

            data.phone ? { phone: data.phone } : {},
            data.email ? { email: data.email } : {},
          ],
        },

        {
          NOT: { id: updateId },
        },
      ],
    },
  });

  if (user?.email && user?.email === data.email)
    ctx.addIssue({
      path: ["email"],
      message: "Email exists",
      code: "custom",
    });

  if (user?.phone && user?.phone === data.phone)
    ctx.addIssue({
      path: ["phone"],
      message: "Phone number exists",
      code: "custom",
    });

  if (user?.username === data.username)
    ctx.addIssue({
      path: ["username"],
      message: "Username has already taken",
      code: "custom",
    });
}

// User validation schema
export const userCreateValidationSchema = userCreateSchema
  .superRefine(async (data, ctx) => {
    await refineUser(data, ctx);
  })
  .transform(async (data) => {
    return {
      ...data,
      password: await hashPassword(data.password),
    };
  });
export const userUpdateValidationSchema = userUpdateSchema
  .extend({
    id: z.number(),
  })
  .superRefine(async (data, ctx) => {
    await refineUser(data, ctx, data.id);
  })
  .transform((data) => {
    return omitFields(data, ["id"]);
  });
