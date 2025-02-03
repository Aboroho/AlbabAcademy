import { NextRequest } from "next/server";
import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { parseJSONData } from "../../utils/parseIncomingData";

import { prismaQ } from "../../utils/prisma";

import { apiResponse } from "../../utils/handleResponse";
import { testimonialValidationSchema } from "../../validationSchema/testimonialSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req: NextRequest) => {
    const data = await parseJSONData(req);
    const parsedData = await testimonialValidationSchema.parseAsync(data);

    const testimonial = await prismaQ.testimonial.create({
      data: {
        ...parsedData,
      },
    });

    return apiResponse({ data: testimonial });
  }
);

export const GET = withMiddleware(async () => {
  const testimonials = await prismaQ.testimonial.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
  return apiResponse({ data: testimonials });
});
