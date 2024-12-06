import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";

import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";

export const DELETE = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (_, { params }: { params: Promise<{ templateId: string }> }) => {
    const templateId = (await params).templateId;

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
