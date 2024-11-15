import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { cohortCreateValidationSchema } from "../../validationSchema/cohortSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const cohortData = await parseJSONData(req);

    const parsedCohort = await cohortCreateValidationSchema.parseAsync(
      cohortData
    );

    const cohort = await prismaQ.cohort.create({
      data: parsedCohort,
    });

    return apiResponse({ data: cohort });
  }
);

export const GET = withMiddleware(authenticate, async (req) => {
  const { searchParams } = req.nextUrl;

  const conditions: { [key: string]: unknown } = {};

  const sectionIdQ = searchParams.get("section_id");
  if (sectionIdQ) {
    const sectionId = parseInt(sectionIdQ);
    if (sectionIdQ === "null") conditions["section_id"] = null;
    else conditions["section_id"] = sectionId ? sectionId : -1;
  }

  const cohort = await prismaQ.cohort.findMany({
    where: {
      ...conditions,
    },
    include: {
      section: {
        include: {
          grade: true,
        },
      },
    },
  });
  return apiResponse({ data: cohort });
});
