import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { apiResponse } from "../../utils/handleResponse";
import { noticeCreateValidationSchema } from "../../validationSchema/noticeSchema";

import { getAuthSession } from "../../middlewares/auth/helper";
import { NoticeService } from "../../services/notice.service";

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

export const GET = withMiddleware(authenticate, async (req) => {
  const session = await getAuthSession();
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get("page") || "") || 1;
  const pageSize = parseInt(searchParams.get("pageSize") || "") || 50;
  const noticeService = new NoticeService(prismaQ);
  if (session?.user.role === "ADMIN") {
    const { notices, count } = await noticeService.findAll({ page, pageSize });

    return apiResponse({ data: { count, notices } });
  }
});
