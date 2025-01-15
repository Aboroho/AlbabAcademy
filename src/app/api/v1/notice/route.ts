import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { apiResponse } from "../../utils/handleResponse";
import { noticeCreateValidationSchema } from "../../validationSchema/noticeSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const noticeData = await parseJSONData(req);
    const parsedNotice = await noticeCreateValidationSchema.parseAsync(
      noticeData
    );

    const notice = await prismaQ.notice.create({
      data: parsedNotice,
    });

    return apiResponse({ data: notice });
  }
);
