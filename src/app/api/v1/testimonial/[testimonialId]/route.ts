import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";
import { testimonialValidationSchema } from "@/app/api/validationSchema/testimonialSchema";

export const DELETE = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (
    request: Request,
    { params }: { params: { testimonialId: string } }
  ) => {
    const testimonialId = Number(params.testimonialId);
    const testimonial = await prismaQ.testimonial.findUnique({
      where: { id: testimonialId },
    });
    if (!testimonial) {
      throw new APIError("Testimonial not found", 404);
    }
    await prismaQ.testimonial.delete({
      where: { id: testimonialId },
    });

    return apiResponse({
      data: {
        message: "Testimonial deleted successfully",
      },
    });
  }
);

export const PUT = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req, { params }: { params: { testimonialId: string } }) => {
    const data = await req.json();
    const testimonialId = Number(params.testimonialId);
    const testimonial = await prismaQ.testimonial.findUnique({
      where: { id: testimonialId },
    });
    if (!testimonial) {
      throw new APIError("Testimonial not found", 404);
    }
    const parsedData = await testimonialValidationSchema.parseAsync(data);
    const updatedTestimonial = await prismaQ.testimonial.update({
      where: { id: testimonialId },
      data: parsedData,
    });
    return apiResponse({
      data: updatedTestimonial,
    });
  }
);

export const GET = withMiddleware(
  async (
    request: Request,
    { params }: { params: { testimonialId: string } }
  ) => {
    const testimonialId = Number(params.testimonialId);

    const testimonial = await prismaQ.testimonial.findUnique({
      where: { id: testimonialId },
    });
    if (!testimonial) {
      throw new APIError("Testimonial not found", 404);
    }
    return apiResponse({
      data: testimonial,
    });
  }
);
