import {
  authenticate,
  authorizeTeacherAndAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { z } from "zod";

export const GET = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (
    req,
    { params }: { params: Promise<{ assessmentId: string; subjectId: string }> }
  ) => {
    const assessmentId = Number((await params).assessmentId);
    const subjectId = Number((await params).subjectId);

    const results = await prismaQ.assessment.findUnique({
      where: {
        id: assessmentId,
      },
      select: {
        title: true,
        assessment_type: true,

        assessment_subjects: {
          select: {
            subject_name: true,
            total_marks: true,
          },
        },
        grade: {
          select: {
            name: true,
          },
        },
        assessment_results: {
          where: {
            assessment_subject_id: subjectId,
          },
          select: {
            mark: true,
            student: {
              select: {
                id: true,
                full_name: true,
                cohort: true,
                roll: true,
              },
            },
          },
          orderBy: {
            student: {
              cohort: {
                name: "asc",
              },
            },
            
          },
        },
        
      },
      
    });

    return apiResponse({ data: results });
  }
);

const schema = z.object({
  results: z.array(
    z.object({
      student_id: z.number(),
      mark: z.number(),
    })
  ),
});

export const PUT = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (
    req,
    { params }: { params: Promise<{ assessmentId: string; subjectId: string }> }
  ) => {
    const assessmentId = Number((await params).assessmentId);
    const subjectId = Number((await params).subjectId);

    const data = await parseJSONData(req);
    const parsedMark = await schema.parseAsync(data);

    const results = await Promise.all(
      parsedMark.results.map(async (result) => {
        return await prismaQ.assessmentResult.update({
          where: {
            assessment_id_assessment_subject_id_student_id: {
              student_id: result.student_id,
              assessment_subject_id: subjectId,
              assessment_id: assessmentId,
            },
          },
          data: {
            mark: result.mark,
          },
        });
      })
    );

    console.log(results);

    return apiResponse({ data: results });
  }
);
