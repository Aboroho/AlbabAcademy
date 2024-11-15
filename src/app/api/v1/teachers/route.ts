import { ITeacherResponse } from "@/types/response_types";
import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { hashPassword } from "../../utils/encryption";
import { omitFields } from "../../utils/excludeFields";
import { validateFileAndMove } from "../../utils/fileUploader";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { teacherCreateValidationSchema } from "../../validationSchema/teacherSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const teacherData = await parseJSONData(req);

    const parsedTeacher = await teacherCreateValidationSchema.parseAsync(
      teacherData
    );

    const teacher = await prismaQ.$transaction(async (prismaQ) => {
      const parsedUser = parsedTeacher.user;
      const parsedAddress = parsedTeacher.address;

      if (parsedUser.avatar) {
        parsedUser.avatar = await validateFileAndMove(parsedUser.avatar);
      }
      const user = await prismaQ.user.create({
        data: {
          role: "TEACHER",
          ...parsedUser,
        },
      });

      parsedTeacher.user.avatar = await validateFileAndMove(
        parsedTeacher.user.avatar
      );

      const address = await prismaQ.address.create({
        data: parsedAddress,
      });

      const refinedTeacher = {
        ...omitFields(parsedTeacher, ["address", "user"]),

        user_id: user.id,
        address_id: address.id,
      };

      const teacher = await prismaQ.teacher.create({
        data: refinedTeacher,
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
    return apiResponse({ data: res, statusCode: 201 });
  }
);

export const GET = withMiddleware(authenticate, authorizeAdmin, async () => {
  const teachers = await prismaQ.teacher.findMany({
    include: {
      address: true,
      user: true,
    },
  });

  const res: ITeacherResponse[] = teachers.map((teacher) => {
    return {
      ...teacher,
      user: omitFields(teacher.user, ["password"]),
    };
  });

  return apiResponse({ data: res });
});
