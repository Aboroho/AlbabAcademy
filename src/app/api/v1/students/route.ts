import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { StudentService } from "../../services/student.service";

const studentService = new StudentService();

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const studentData = await parseJSONData(req);
    const studentProfileDTO = await studentService.create(studentData);
    return apiResponse({ data: studentProfileDTO });
  }
);

export const GET = withMiddleware(authenticate, authorizeAdmin, async () => {
  const studentList = await studentService.findAll();
  return apiResponse({ data: studentList });
});
