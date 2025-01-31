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
  async (req, { params }: { params: Promise<{ assessmentId: string }> }) => {
    const assessmentId = Number((await params).assessmentId);
    await prismaQ.assessment.delete({
      where: {
        id: assessmentId,
      },
    });
    return apiResponse({ message: "Assessment deleted successfully" });
  }
);
