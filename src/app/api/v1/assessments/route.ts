import {
  authenticate,
  authorizeAdmin,
  authorizeTeacherAndAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { omitFields } from "../../utils/excludeFields";
import { APIError } from "../../utils/handleError";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { AssessmentSchema } from "../../validationSchema/assesmentSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const assessmentData = await parseJSONData(req);
    const user = JSON.parse(req.headers.get("x-user") || "");
    assessmentData.creator_id = user?.id;
    const parsedAssesment = await AssessmentSchema.parseAsync(assessmentData);

    // const assesmentSubjects = parsedAssesment.assessmentSubjects.map(sub => ({..sub, id : }))
    const assement = await prismaQ.assessment.create({
      data: {
        ...omitFields(parsedAssesment, ["assessment_subjects"]),
        assessment_subjects: {
          create: parsedAssesment.assessment_subjects,
        },
      },
      include: {
        assessment_subjects: true,
      },
    });

    return apiResponse({ data: assement });
  }
);

export const GET = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req) => {
    const user = JSON.parse(req.headers.get("x-user") || "");

    if (user.role === "TEACHER") {
      const teacher = await prismaQ.teacher.findUnique({
        where: {
          user_id: user.id,
        },
      });
      if (!teacher) throw new APIError("No data found");

      const assessments = await prismaQ.assessment.findMany({
        where: {
          assessment_subjects: {
            some: {
              teacher_id: teacher.id,
            },
          },
        },
        include: {
          assessment_subjects: {
            where: {
              teacher_id: teacher.id,
            },
            select: {
              id: true,
              subject_name: true,
              total_mark: true,
              teacher_id: true,
            },
          },
        },
      });
      return apiResponse({ data: assessments });
    } else {
      const assessments = await prismaQ.assessment.findMany({
        include: {
          assessment_subjects: true,
        },
      });
      return apiResponse({ data: assessments });
    }
  }
);
