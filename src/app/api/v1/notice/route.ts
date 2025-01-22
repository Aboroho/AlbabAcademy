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
import { NoticeCategory, NoticeTarget } from "@prisma/client";

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
  let noticeCategory: any = searchParams.get("notice_category") || undefined;
  if (noticeCategory) noticeCategory = noticeCategory.split(",");

  const noticeService = new NoticeService(prismaQ);

  if (session?.user.role === "ADMIN") {
    const { notices, count } = await noticeService.findAll({
      page,
      pageSize,
      category: noticeCategory as NoticeCategory[],
    });

    return apiResponse({ data: { count, notices } });
  }
  const target =
    session?.user.role === "STUDENT"
      ? "STUDENT"
      : session?.user.role === "TEACHER"
      ? "TEACHER"
      : "ALL_USERS";
  const targets = [target, "ALL_USER"] as NoticeTarget[];
  const { notices, count } = await noticeService.findAll({
    page,
    pageSize,
    category: noticeCategory as NoticeCategory[],
    target: targets,
  });

  return apiResponse({ data: { count, notices } });
});
