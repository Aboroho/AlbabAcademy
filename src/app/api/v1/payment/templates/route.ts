import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { omitFields } from "@/app/api/utils/excludeFields";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { paymentTemplateCreateValidationSchema } from "@/app/api/validationSchema/paymentSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const paymentTemplateData = await parseJSONData(req);

    const parsedPaymentTemplate =
      await paymentTemplateCreateValidationSchema.parseAsync(
        paymentTemplateData
      );

    const paymentTemplate = await prismaQ.paymentTemplate.create({
      data: {
        ...omitFields(parsedPaymentTemplate, ["template_fields"]),
        template_fields: {
          create: parsedPaymentTemplate.template_fields,
        },
      },
      include: {
        template_fields: true,
      },
    });

    return apiResponse({ data: paymentTemplate });
  }
);

export const GET = withMiddleware(authenticate, authorizeAdmin, async () => {
  const templates = await prismaQ.paymentTemplate.findMany({
    include: {
      template_fields: true,
    },
  });
  return apiResponse({ data: templates });
});
