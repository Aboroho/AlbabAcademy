import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { StudentService } from "@/app/api/services/student.service";
import { APIError } from "@/app/api/utils/handleError";

import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";

const studentService = new StudentService();

export const GET = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ student_id: string }> }) => {
    const studentId = (await params).student_id;
    const student = await studentService.findById(parseInt(studentId));
    return apiResponse({ data: student });
  }
);

export const PUT = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ student_id: string }> }) => {
    const studentId = parseInt((await params).student_id);
    const studentData = await parseJSONData(req);
    const student = await studentService.update(studentId, studentData);
    return apiResponse({ data: student });
  }
);

export const DELETE = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ student_id: string }> }) => {
    const studentId = parseInt((await params).student_id);
    const student = await prismaQ.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!student) throw new APIError("No teacher found", 404);

    await prismaQ.student.delete({
      where: {
        id: studentId,
      },
      include: {
        user: true,
        address: true,
      },
    });

    return apiResponse({ data: { id: student.id } });
  }
);
