import { validateFileAndMove } from "../../utils/fileUploader";
import { withError } from "../../utils/handleError";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";

export const POST = withError(async (req) => {
  const data = await parseJSONData(req);
  const avatar = await validateFileAndMove(data.avatar);
  console.log(avatar);
  return apiResponse({ data: { avatar: avatar } });
});
