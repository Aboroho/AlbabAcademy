import {
  authenticate,
  authorizeTeacherAndAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { APIError } from "../../utils/handleError";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { attendanceValidationSchema } from "../../validationSchema/attendenceSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req) => {
    const attendenceData = await parseJSONData(req);

    const parsedData = await attendanceValidationSchema.parseAsync(
      attendenceData
    );

    const { data, date } = parsedData;

    const attendanceList = await Promise.all(
      data.map(async (student) => {
        return await prismaQ.studentAttendance.upsert({
          create: {
            status: student.status,
            student_id: student.student_id,
            date: date,
          },
          update: {
            status: student.status,
          },
          where: {
            date_student_id: {
              student_id: student.student_id,
              date: date,
            },
          },
        });
      })
    );

    return apiResponse({
      data: {
        data: attendanceList,
        date,
      },
    });
  }
);

export const GET = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req) => {
    const { searchParams } = req.nextUrl;
    const cohortID = parseInt(searchParams.get("cohortId") || "") || undefined;
    const date = searchParams.get("date")?.split("T")?.[0];

    if (!cohortID || !date)
      throw new APIError("date and cohortId are required");

    const givenDate = new Date(date);

    const students = await prismaQ.student.findMany({
      select: {
        id: true,
        full_name: true,
        roll: true,
        attendance_record: {
          select: {
            date: true,
            status: true,
          },
          where: {
            date: {
              equals: givenDate,
            },
          },
        },
      },
      where: {
        cohort_id: cohortID,
      },
      orderBy: {
        roll: "asc",
      },
    });

    return apiResponse({ data: students });
  }
);
