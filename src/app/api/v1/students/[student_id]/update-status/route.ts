import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";

export const PATCH = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ student_id: string }> }) => {
    const studentId = (await params).student_id;

    const { status } = await parseJSONData(req);

    if (status !== "ACTIVE" && status !== "INACTIVE" && status != "GRADUATED")
      throw new APIError("Invalid status");

    const student = await prismaQ.student.update({
      where: { id: parseInt(studentId) },
      data: {
        student_status: status,
      },
    });

    return apiResponse({ data: student });
  }
);
