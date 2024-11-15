import { sectionCreateSchema } from "@/components/forms/section-details-form/schema";
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
    const sectionData = await parseJSONData(req);

    const parsedGrade = await sectionCreateSchema.parseAsync(sectionData);

    const section = await prismaQ.section.create({
      data: parsedGrade,
    });

    return apiResponse({ data: section });
  })(req, params);
};
export const GET: ApiRoute = async (req, params) => {
  return await withMiddleware(authenticate, async (req) => {
    const { searchParams } = req.nextUrl;

    const conditions: { [key: string]: unknown } = {};

    const gradeIdQ = searchParams.get("grade_id");
    if (gradeIdQ) {
      const gradeId = parseInt(gradeIdQ);
      if (gradeId) conditions["grade_id"] = gradeId;
    }

    const section = await prismaQ.section.findMany({
      where: {
        ...conditions,
      },
      include: {
        grade: true,
      },
    });
    return apiResponse({ data: section });
  })(req, params);
};
