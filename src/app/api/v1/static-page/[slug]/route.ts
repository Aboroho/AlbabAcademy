import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { staticPageValidationSchema } from "@/app/api/validationSchema/staticPageSchema";

export const GET = withMiddleware(async (req, { params }) => {
  const page = await prismaQ.staticPage.findUnique({
    where: {
      slug: params.slug,
    },
  });
  if (!page) throw new Error("Page not found");
  return apiResponse({
    data: page,
  });
});

export const PATCH = withMiddleware(async (req, { params }) => {
  const data = await parseJSONData(req);
  data.slug = params.slug;
  const parsedData = await staticPageValidationSchema.parseAsync(data);
  const page = await prismaQ.staticPage.upsert({
    where: {
      slug: params.slug,
    },
    update: parsedData,
    create: parsedData,
  });
  return apiResponse({
    data: page,
  });
});
