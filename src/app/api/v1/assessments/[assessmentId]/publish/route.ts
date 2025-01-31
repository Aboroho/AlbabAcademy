import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { AssessmentStatus } from "@prisma/client";

export const UPDATE = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ assessmentId: string }> }) => {
    const assessmentId = Number((await params).assessmentId);
    const data = await parseJSONData(req);
    if (!data || !(data.status === "PUBLISH" || data.status === "PENDING"))
      throw new APIError("Invalid status");

    const assessment = await prismaQ.assessment.update({
      where: {
        id: assessmentId,
      },
      data: {
        status: data.status as AssessmentStatus,
      },
      select: {
        id: true,
      },
    });
    return apiResponse({
      message: "Assessment update successfully",
      data: assessment,
    });
  }
);
