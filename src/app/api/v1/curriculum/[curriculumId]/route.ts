import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";

import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";
import { curriculumValidationSchema } from "@/app/api/validationSchema/curriculumSchema";

export const GET = withMiddleware(
  async (req, { params }: { params: { curriculumId: string } }) => {
    const curriculumId = Number(params.curriculumId);

    const curriculum = await prismaQ.curriculum.findUnique({
      where: {
        id: curriculumId,
      },
    });
    if (!curriculum) throw new APIError("Curriculum not found", 404);
    return apiResponse({ data: curriculum });
  }
);

export const DELETE = withMiddleware(
  async (req, { params }: { params: { curriculumId: string } }) => {
    const curriculumId = Number(params.curriculumId);
    await prismaQ.curriculum.delete({
      where: {
        id: curriculumId,
      },
    });

    return apiResponse({ message: "Curriculum deleted successfully" });
  }
);

export const PUT = withMiddleware(
  async (req, { params }: { params: { curriculumId: string } }) => {
    const curriculumId = Number(params.curriculumId);

    const curriculum = await prismaQ.curriculum.findUnique({
      where: {
        id: curriculumId,
      },
    });
    if (!curriculum) throw new APIError("Curriculum not found", 404);
    const data = await req.json();
    const parsedData = curriculumValidationSchema.parse(data);
    const updatedCurriculum = await prismaQ.curriculum.update({
      where: {
        id: curriculumId,
      },
      data: parsedData,
    });
    return apiResponse({ data: updatedCurriculum });
  }
);
