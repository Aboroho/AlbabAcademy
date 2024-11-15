import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { sectionCreateValidationSchema } from "@/app/api/validationSchema/sectionSchema";
import { ApiRoute } from "@/types/common";

export const GET: ApiRoute = async (req, params) => {
  return await withMiddleware(
    authenticate,
    authorizeAdmin,
    async (req, { params }: { params: Promise<{ section_id: string }> }) => {
      const sectionId = Number((await params).section_id);

      const section = await prismaQ.section.findUnique({
        where: {
          id: sectionId,
        },
        include: {
          grade: true,
        },
      });

      if (!section) throw new APIError("No section found", 404);

      return apiResponse({ data: section });
    }
  )(req, params);
};

export const PUT: ApiRoute = async (req, params) => {
  return await withMiddleware(
    authenticate,
    authorizeAdmin,
    async (req, { params }: { params: Promise<{ section_id: string }> }) => {
      const sectionId = Number((await params).section_id);
      const sectionData = await parseJSONData(req);
      const sectionInfo = await prismaQ.section.findUnique({
        where: {
          id: sectionId,
        },
      });

      if (!sectionInfo) throw new APIError("section not found", 404);

      sectionData.id = sectionInfo?.id;
      const parsedsection = await sectionCreateValidationSchema.parseAsync(
        sectionData
      );
      const section = await prismaQ.section.update({
        where: {
          id: sectionId,
        },
        data: parsedsection,
      });

      return apiResponse({ data: section });
    }
  )(req, params);
};
