import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { noticeUpdateValidationSchema } from "@/app/api/validationSchema/noticeSchema";

export const DELETE = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ noticeId: string }> }) => {
    const noticeId = Number((await params).noticeId);
    const notice = await prismaQ.notice.findUnique({
      where: {
        id: noticeId,
      },
    });

    if (!notice) throw new APIError("No notice found", 404);

    await prismaQ.notice.delete({
      where: {
        id: noticeId,
      },
    });

    return apiResponse({
      statusCode: 200,
      data: { id: noticeId },
    });
  }
);

export const GET = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ noticeId: string }> }) => {
    const noticeId = Number((await params).noticeId);
    const notice = await prismaQ.notice.findUnique({
      where: {
        id: noticeId,
      },
    });

    if (!notice) throw new APIError("No notice found", 404);
    return apiResponse({
      data: notice,
    });
  }
);

export const PUT = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ noticeId: string }> }) => {
    const noticeId = parseInt((await params).noticeId);
    const noticeData = await parseJSONData(req);

    const noticeInfo = await prismaQ.notice.findUnique({
      where: {
        id: noticeId,
      },
    });
    if (!noticeInfo || !noticeId) throw new APIError("No notice found", 404);

    // transaction

    const parsedNotice = await noticeUpdateValidationSchema.parseAsync(
      noticeData
    );

    const notice = await prismaQ.notice.update({
      where: {
        id: noticeId,
      },
      data: {
        ...parsedNotice,
      },
    });

    return apiResponse({ data: notice });
  }
);
