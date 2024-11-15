import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { hashPassword } from "../../utils/encryption";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { studentCreateValidatoinSchema } from "../../validationSchema/studentSchema";

import { excludeFields, omitFields } from "../../utils/excludeFields";

import { validateFileAndMove } from "../../utils/fileUploader";
import { Role } from "@prisma/client";
import {
  IStudentResponse,
  IStudentResponseWithPaymentInfo,
} from "@/types/response_types";

const allUserField = {
  id: true,
  username: true,
  password: true,
  role: true,
  phone: true,
  email: true,
  avatar: true,
  createdAt: true,
};

// create student
export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const studentData = await parseJSONData(req);

    // transaction
    const { student, payment } = await prismaQ.$transaction(async (prismaQ) => {
      // validate and create user
      const parsedStudent = await studentCreateValidatoinSchema.parseAsync(
        studentData
      );
      const parsedUser = parsedStudent.user;

      if (parsedUser.avatar) {
        parsedUser.avatar = await validateFileAndMove(parsedUser.avatar, {
          type: ["image/jpeg", "image/png"],
        });
      }
      // parsedUser.password = await hashPassword(parsedUser.password);
      const refinedUser = {
        ...parsedUser,
        role: "STUDENT" as Role,
      };
      const user = await prismaQ.user.create({
        data: refinedUser,
      });

      console.log(user);

      // validate and create address
      const parsedAddress = parsedStudent.address;
      const address = await prismaQ.address.create({
        data: parsedAddress,
      });

      console.log(address);
      studentData.user_id = user.id;
      studentData.address_id = address.id;

      const refinedStudent = {
        ...omitFields(parsedStudent, [
          "user",
          "address",
          "payment_template_id",
          "payment_status",
        ]),
        user_id: user.id,
        address_id: address.id,
      };

      const student = await prismaQ.student.create({
        data: refinedStudent,
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

      // initial payment
      if (parsedStudent.payment_template_id && parsedStudent.payment_status) {
        const paymentRequest = await prismaQ.paymentRequest.create({
          data: {
            payment_target_type: "STUDENT",
            title:
              "Initial Payment for " +
              student.student_id +
              " - " +
              student.father_name,
            payment_template_id: parsedStudent.payment_template_id,
          },
        });
        const payment = await prismaQ.payment.create({
          data: {
            payment_request_id: paymentRequest.id,
            user_id: user.id,
            status: parsedStudent.payment_status,
          },
        });
        return { student, payment };
      }

      return { student };
    });

    const flattenedStudent: IStudentResponseWithPaymentInfo = {
      ...student,
      cohort: omitFields(student.cohort, ["section"]),
      section: omitFields(student.cohort.section, ["grade"]),
      grade: student.cohort.section.grade,
      user: omitFields(student.user, ["password"]),
      payment,
    };

    return apiResponse({ data: flattenedStudent });
  }
);

// get student
export const GET = withMiddleware(authenticate, authorizeAdmin, async () => {
  const students = await prismaQ.student.findMany({
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
    orderBy: {
      cohort: {
        section: {
          grade: {
            name: "asc",
          },
        },
      },
    },
  });
  const flattenedStudents: IStudentResponse[] = students.map((student) => {
    return {
      ...student,
      cohort: omitFields(student.cohort, ["section"]),
      section: omitFields(student.cohort.section, ["grade"]),
      grade: student.cohort.section.grade,
      user: omitFields(student.user, ["password"]),
    };
  });

  return apiResponse({ data: flattenedStudents });
});
