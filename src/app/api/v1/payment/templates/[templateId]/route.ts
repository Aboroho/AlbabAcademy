import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";

export const DELETE = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (_, { params }: { params: Promise<{ templateId: string }> }) => {
    const templateId = (await params).templateId;
    const paymentRequest = await prismaQ.paymentRequest.findFirst({
      where: {
        payment_template_id: parseInt(templateId),
      },
    });

    if (paymentRequest) {
      throw new APIError(
        "There are some payment request associated with this payment template. You can not delete this template."
      );
    }
    const status = await prismaQ.paymentTemplate.delete({
      where: {
        id: parseInt(templateId),
      },
    });

    return apiResponse({
      data: status.id,
      message: "Templated deleted successfully",
    });
  }
);
