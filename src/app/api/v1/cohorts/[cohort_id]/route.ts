import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { cohortCreateValidationSchema } from "@/app/api/validationSchema/cohortSchema";
import { ApiRoute } from "@/types/common";

export const GET: ApiRoute = async (req, params) => {
  return await withMiddleware(
    authenticate,
    authorizeAdmin,
    async (req, { params }: { params: Promise<{ cohort_id: string }> }) => {
      const cohortId = Number((await params).cohort_id);

      const cohort = await prismaQ.cohort.findUnique({
        where: {
          id: cohortId,
        },
        include: {
          section: {
            include: {
              grade: true,
            },
          },
        },
      });

      if (!cohort) throw new APIError("No cohort found", 404);

      return apiResponse({ data: cohort });
    }
  )(req, params);
};

export const PUT: ApiRoute = async (req, params) => {
  return await withMiddleware(
    authenticate,
    authorizeAdmin,
    async (req, { params }: { params: Promise<{ cohort_id: string }> }) => {
      const cohortId = Number((await params).cohort_id);
      const cohortData = await parseJSONData(req);
      const cohortInfo = await prismaQ.cohort.findUnique({
        where: {
          id: cohortId,
        },
      });

      if (!cohortInfo) throw new APIError("cohort not found", 404);

      cohortData.id = cohortInfo?.id;
      const parsedcohort = await cohortCreateValidationSchema.parseAsync(
        cohortData
      );
      const cohort = await prismaQ.cohort.update({
        where: {
          id: cohortId,
        },
        data: parsedcohort,
      });

      return apiResponse({ data: cohort });
    }
  )(req, params);
};
