import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { StudentService } from "@/app/api/services/student.service";

import { apiResponse } from "@/app/api/utils/handleResponse";

const studentService = new StudentService();
export const GET = withMiddleware(authenticate, authorizeAdmin, async (req) => {
  const searchParams = Object.fromEntries(new URL(req.nextUrl).searchParams);

  const payments = await studentService.findAllWithPayment(searchParams);
  return apiResponse({ data: payments });
});
