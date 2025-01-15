import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { NoticeService } from "@/app/api/services/notice.service";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";
import { NoticeCategory, NoticeTarget } from "@prisma/client";

export const GET = withMiddleware(async (req) => {
  const { searchParams } = req.nextUrl;

  const noticeCategory = searchParams.get("notice_category") as NoticeCategory;
  const noticeTarget =
    (searchParams.get("notice_target") as NoticeTarget) || "ALL_USERS";
  const page = parseInt(searchParams.get("page") || "") || 1;
  const pageSize = parseInt(searchParams.get("pageSize") || "") || 50;

  const noticeService = new NoticeService(prismaQ);
  const { notices, count } = await noticeService.findAllWithFilter({
    category: noticeCategory,
    type: "PUBLIC",

    page,
    pageSize,
    target: noticeTarget,
  });
  return apiResponse({ data: { count, notices } });
});
