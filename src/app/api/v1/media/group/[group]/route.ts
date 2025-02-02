import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";

export const GET = withMiddleware(
  async (req, { params }: { params: Promise<{ group: string }> }) => {
    const group = (await params).group;

    const media = await prismaQ.media.findMany({
      where: {
        group: group,
      },
    });

    return apiResponse({ data: media });
  }
);
