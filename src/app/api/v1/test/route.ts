import { ApiRoute } from "@/types/common";
import { validateFileAndMove } from "../../utils/fileUploader";

import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { withMiddleware } from "../../middlewares/withMiddleware";

export const POST: ApiRoute = async (req, params) => {
  return await withMiddleware(async (req) => {
    const data = await parseJSONData(req);
    const avatar = await validateFileAndMove(data.avatar);
    console.log(avatar);
    return apiResponse({ data: { avatar: avatar } });
  })(req, params);
};
