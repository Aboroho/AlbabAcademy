import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { staticPageValidationSchema } from "../../validationSchema/staticPageSchema";
import { apiResponse } from "../../utils/handleResponse";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const data = await parseJSONData(req);
    const parsedData = await staticPageValidationSchema.parse(data);

    const exist = await prismaQ.staticPage.findUnique({
      where: {
        slug: parsedData.slug,
      },
    });
    if (exist) throw new Error("Slug already exists");
    const page = await prismaQ.staticPage.create({
      data: parsedData,
    });
    return apiResponse({
      data: page,
      statusCode: 201,
    });
  }
);
export const GET = withMiddleware(async () => {
  const pages = await prismaQ.staticPage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return apiResponse({
    data: pages,
  });
});
