import { authenticate } from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";

export const GET = withMiddleware(
  authenticate,
  async (req, { params }: { params: Promise<{ userId: string }> }) => {
    const userId = Number((await params).userId);

    const student = await prismaQ.student.findUnique({
      where: {
        user_id: userId,
      },
    });

    return apiResponse({ data: student });
  }
);
