import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { excludeFields, omitFields } from "@/app/api/utils/excludeFields";
import { validateFileAndMove } from "@/app/api/utils/fileUploader";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { studentUpdateValidationSchema } from "@/app/api/validationSchema/studentSchema";
// import { IStudentResponse } from "@/types/response_types";

export const GET = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ student_id: string }> }) => {
    const student_id = (await params).student_id;

    const student = await prismaQ.student.findUnique({
      where: {
        id: parseInt(student_id),
      },
      include: {
        user: true,
        address: true,
        cohort: {
          include: {
            section: {
              include: {
                grade: true,
              },
            },
          },
        },
      },
    });

    if (student) {
      const refinedStudent = {
        ...omitFields(student, ["cohort", "user"]),
        user: omitFields(student.user, ["password", "role"]),
        cohort: omitFields(student.cohort, ["section"]),
        section: excludeFields(student.cohort.section, ["grade"]),
        grade: student.cohort.section,
      };
      return apiResponse({ data: refinedStudent });
    }
    throw new APIError("No student found", 404);
  }
);

export const PUT = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ student_id: string }> }) => {
    const studentId = parseInt((await params).student_id);
    const studentData = await parseJSONData(req);

    const studentInfo = await prismaQ.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!studentInfo || !studentId) throw new APIError("No student found", 404);

    // this step is for validation
    if (studentData.user) studentData.user.id = studentInfo.user_id;
    studentData.id = studentId;

    // transaction
    const student = await prismaQ.$transaction(async (prismaQ) => {
      const parsedStudent = await studentUpdateValidationSchema.parseAsync(
        studentData
      );

      const parsedUser = parsedStudent.user;

      if (parsedUser.avatar) {
        parsedUser.avatar = await validateFileAndMove(parsedUser.avatar, {
          type: ["image/jpeg", "image/png"],
        });
      }
      console.log(parsedUser.avatar);

      const student = await prismaQ.student.update({
        where: {
          id: studentId,
        },
        data: {
          ...excludeFields(parsedStudent, ["cohort_id"]),
          cohort: {
            connect: { id: parsedStudent.cohort_id },
          },
          user: {
            update: parsedStudent.user,
          },
          address: {
            update: parsedStudent.address,
          },
        },
        include: {
          cohort: {
            include: {
              section: {
                include: {
                  grade: true,
                },
              },
            },
          },
          user: true,
          address: true,
        },
      });

      return student;
    });

    const flattenedStudent = {
      ...student,
      cohort: omitFields(student.cohort, ["section"]),
      section: omitFields(student.cohort.section, ["grade"]),
      grade: student.cohort.section.grade,
      user: omitFields(student.user, ["password"]),
    };

    return apiResponse({ data: flattenedStudent });
  }
);
