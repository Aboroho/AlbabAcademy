import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { StudentService } from "@/app/api/services/student.service";

import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";

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
