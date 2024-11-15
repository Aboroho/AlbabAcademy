import { gradeCreateSchema } from "@/components/forms/grade-details-form/schema";
import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { ApiRoute } from "@/types/common";

export const POST: ApiRoute = async (req, params) => {
  return await withMiddleware(authenticate, authorizeAdmin, async (req) => {
    const gradeData = await parseJSONData(req);

    const parsedGrade = await gradeCreateSchema.parseAsync(gradeData);

    const grade = await prismaQ.grade.create({
      data: parsedGrade,
    });

    return apiResponse({ data: grade });
  })(req, params);
};

export const GET: ApiRoute = async (req, params) => {
  return await withMiddleware(authenticate, async () => {
    const grades = await prismaQ.grade.findMany();
    return apiResponse({ data: grades });
  })(req, params);
};
