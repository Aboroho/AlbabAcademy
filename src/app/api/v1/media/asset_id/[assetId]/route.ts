import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import cloudinary from "@/app/api/utils/cloudinary";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";

export const DELETE = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: Promise<{ assetId: string }> }) => {
    const assetId = (await params).assetId;

    await cloudinary.uploader.destroy(assetId);
    const media = await prismaQ.media.delete({
      where: {
        asset_id: assetId,
      },
    });

    return apiResponse({ data: media });
  }
);
