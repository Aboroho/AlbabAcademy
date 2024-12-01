import { authenticate } from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { StudentService } from "@/app/api/services/student.service";
import { apiResponse } from "@/app/api/utils/handleResponse";

export const GET = withMiddleware(
  authenticate,
  async (req, { params }: { params: Promise<{ student_id: string }> }) => {
    const studentId = (await params).student_id;

    const studentService = new StudentService();

    const studentProfile = await studentService.getProfile(parseInt(studentId));

    return apiResponse({ data: studentProfile });
  }
);
