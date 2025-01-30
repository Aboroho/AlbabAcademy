import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { omitFields } from "../../utils/excludeFields";

import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { AssessmentSchema } from "../../validationSchema/assesmentSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const assessmentData = await parseJSONData(req);

    const parsedAssesment = await AssessmentSchema.parseAsync(assessmentData);
    const sectionIds = parsedAssesment.section_ids;

    const students = await prismaQ.student.findMany({
      select: {
        id: true,
      },
      where: {
        cohort: {
          section: {
            id: {
              in: sectionIds,
            },
          },
        },
      },
    });
    // const assesmentSubjects = parsedAssesment.assessmentSubjects.map(sub => ({..sub, id : }))
    const [assessmentId, assessmentSubjectIds] = await prismaQ.$transaction(
      async (tx) => {
        const assessment = await tx.assessment.create({
          data: {
            ...omitFields(parsedAssesment, [
              "assessment_subjects",
              "section_ids",
            ]),
            assessment_subjects: {
              createMany: {
                data: parsedAssesment.assessment_subjects.map((sub) => ({
                  ...sub,
                })),
              },
            },
          },
          select: {
            id: true,
            assessment_subjects: {
              select: {
                id: true,
              },
            },
          },
        });

        const assessmentId = assessment.id;
        const assessmentSubjectIds = assessment.assessment_subjects;

        await tx.assessmentResult.createMany({
          data: students
            .map((student) => {
              const resultData = assessmentSubjectIds.map((sub) => ({
                assessment_id: assessmentId,
                student_id: student.id,
                assessment_subject_id: sub.id,
                mark: 0,
              }));
              return resultData;
            })
            .flat(),
        });

        return [assessmentId, assessmentSubjectIds];
      }
    );
    return apiResponse({ data: { assessmentId, assessmentSubjectIds } });
  }
);

// export const GET = withMiddleware(
//   authenticate,
//   authorizeTeacherAndAdmin,
//   async (req) => {
//     const user = JSON.parse(req.headers.get("x-user") || "");

//     if (user.role === "TEACHER") {
//       const teacher = await prismaQ.teacher.findUnique({
//         where: {
//           user_id: user.id,
//         },
//       });
//       if (!teacher) throw new APIError("No data found");

//       const assessments = await prismaQ.assessment.findMany({
//         where: {
//           assessment_subjects: {
//             some: {
//               teacher_id: teacher.id,
//             },
//           },
//         },
//         include: {
//           assessment_subjects: {
//             where: {
//               teacher_id: teacher.id,
//             },
//             select: {
//               id: true,
//               subject_name: true,
//               total_mark: true,
//               teacher_id: true,
//             },
//           },
//         },
//       });
//       return apiResponse({ data: assessments });
//     } else {
//       const assessments = await prismaQ.assessment.findMany({
//         include: {
//           assessment_subjects: true,
//         },
//       });
//       return apiResponse({ data: assessments });
//     }
//   }
// );
