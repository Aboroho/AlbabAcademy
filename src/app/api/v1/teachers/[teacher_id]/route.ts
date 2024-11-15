import {
  authenticate,
  authorizeAdmin,
  authorizeTeacherAndAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { omitFields } from "@/app/api/utils/excludeFields";
import { validateFileAndMove } from "@/app/api/utils/fileUploader";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { teacherUpdateValidationSchema } from "@/app/api/validationSchema/teacherSchema";
import { ITeacherResponse } from "@/types/response_types";

export const GET = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ teacher_id: string }> }) => {
    const teacherId = (await params).teacher_id;

    const teacher = await prismaQ.teacher.findUnique({
      where: {
        id: parseInt(teacherId),
      },
      include: {
        user: true,
        address: true,
      },
    });

    if (!teacher) throw new APIError("No teacher found", 404);

    const res: ITeacherResponse = {
      ...teacher,
      user: omitFields(teacher.user, ["password"]),
    };
    return apiResponse({ data: res, statusCode: 201 });
  }
);

export const PUT = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ teacher_id: string }> }) => {
    const teacherId = parseInt((await params).teacher_id);
    const teacherData = await parseJSONData(req);

    const teacherInfo = await prismaQ.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });
    if (!teacherInfo || !teacherId) throw new APIError("No student found", 404);

    // this step is for unique validation

    if (teacherData.user) teacherData.user.id = teacherInfo.user_id;

    // transaction
    const teacher = await prismaQ.$transaction(async (prismaQ) => {
      const parsedTeacher = await teacherUpdateValidationSchema.parseAsync(
        teacherData
      );

      const parsedUser = parsedTeacher.user;

      if (parsedUser.avatar) {
        parsedUser.avatar = await validateFileAndMove(parsedUser.avatar, {
          type: ["image/jpeg", "image/png"],
        });
      }

      const teacher = await prismaQ.teacher.update({
        where: {
          id: teacherId,
        },
        data: {
          ...parsedTeacher,
          user: {
            update: parsedTeacher.user,
          },
          address: {
            update: parsedTeacher.address,
          },
        },
        include: {
          user: true,
          address: true,
        },
      });

      return teacher;
    });

    const res: ITeacherResponse = {
      ...teacher,
      user: omitFields(teacher.user, ["password"]),
    };

    return apiResponse({ data: res });
  }
);
