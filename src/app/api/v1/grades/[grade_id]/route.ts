import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { gradeCreateValidationSchema } from "@/app/api/validationSchema/gradeSchema";
import { ApiRoute } from "@/types/common";

export const GET: ApiRoute = async (req, params) => {
  return await withMiddleware(
    authenticate,
    authorizeAdmin,
    async (req, { params }: { params: Promise<{ grade_id: string }> }) => {
      const gradeId = Number((await params).grade_id);

      const grade = await prismaQ.grade.findUnique({
        where: {
          id: gradeId,
        },
      });

      if (!grade) throw new APIError("No grade found", 404);

      return apiResponse({ data: grade });
    }
  )(req, params);
};

export const PUT: ApiRoute = async (req, params) => {
  return await withMiddleware(
    authenticate,
    authorizeAdmin,
    async (req, { params }: { params: Promise<{ grade_id: string }> }) => {
      const gradeId = Number((await params).grade_id);
      const gradeData = await parseJSONData(req);
      const gradeInfo = await prismaQ.grade.findUnique({
        where: {
          id: gradeId,
        },
      });

      if (!gradeInfo) throw new APIError("Grade not found", 404);

      gradeData.id = gradeInfo?.id;
      const parsedGrade = await gradeCreateValidationSchema.parseAsync(
        gradeData
      );
      const grade = await prismaQ.grade.update({
        where: {
          id: gradeId,
        },
        data: parsedGrade,
      });

      return apiResponse({ data: grade });
    }
  )(req, params);
};
