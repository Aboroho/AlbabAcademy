import { authenticate } from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";

export const GET = withMiddleware(authenticate, async () => {
  return apiResponse({ data: "You are passed" });
});
