import { NextRequest } from "next/server";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { APIError } from "../../utils/handleError";
import { uploadFile } from "../../utils/fileUploader";

import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { ApiRoute } from "@/types/common";

export const POST: ApiRoute = async (req, params) => {
  return await withMiddleware(
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
  )(req, params);
};
