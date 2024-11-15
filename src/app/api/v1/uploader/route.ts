import { NextRequest } from "next/server";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { APIError, withError } from "../../utils/handleError";
import { uploadFile } from "../../utils/fileUploader";

import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";

// export const GETs = withMiddleware(authenticate, authorizeAdmin, async () => {
//   return apiResponse({ message: "passed" });
// });

export const GET = withError(() => {
  throw new APIError("oh ho");
  return apiResponse({ data: "hello" });
});

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req: NextRequest) => {
    const data = await req.formData();
    const file = data.get("file") as File;
    if (file) {
      const filePath = await uploadFile(file, { isTmp: true });
      return apiResponse({
        data: filePath,
      });
    }
    throw new APIError("`file` field not found", 400);
  }
);
