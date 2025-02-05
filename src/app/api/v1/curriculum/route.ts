import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { prismaQ } from "../../utils/prisma";
import { curriculumValidationSchema } from "../../validationSchema/curriculumSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const data = await req.json();
    const parsedData = curriculumValidationSchema.parse(data);
    const curriculum = await prismaQ.curriculum.create({
      data: parsedData,
    });

    return apiResponse({
      data: curriculum,
      statusCode: 201,
    });
  }
);

export const GET = withMiddleware(async () => {
  const curriculums = await prismaQ.curriculum.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
  return apiResponse({
    data: curriculums,
  });
});
