import { authenticate } from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";

export const GET = withMiddleware(
  authenticate,

  async (req, { params }: { params: Promise<{ studentId: string }> }) => {
    const studentId = Number((await params).studentId);
    const { searchParams } = new URL(req.url);

    // // join filters

    const page = parseInt(searchParams.get("page") || "") || 1;
    const pageSize = parseInt(searchParams.get("pageSize") || "") || 50;

    const assessments = await prismaQ.assessment.findMany({
      where: {
        assessment_results: {
          some: {
            student_id: studentId,
          },
        },
      },
      select: {
        title: true,
        assessment_type: true,
        id: true,
        created_at: true,
        assessment_results: {
          select: {
            mark: true,
            assessment_subject: {
              select: {
                subject_name: true,
                total_marks: true,
                teacher: {
                  select: {
                    full_name: true,
                    id: true,
                  },
                },
              },
            },
          },
          where: {
            student_id: studentId,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        created_at: "desc",
      },
    });

    const count = await prismaQ.assessment.count({
      where: {
        assessment_results: {
          some: {
            student_id: studentId,
          },
        },
      },
    });

    return apiResponse({
      data: {
        assessments,
        count,
      },
    });
  }
);
