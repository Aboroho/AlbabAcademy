import { authenticate } from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { prismaQ } from "../../utils/prisma";

export const GET = withMiddleware(authenticate, async () => {
  const grades = await prismaQ.grade.findMany({
    select: {
      id: true,
      name: true,
      sections: {
        select: {
          name: true,
          id: true,
          cohorts: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return apiResponse({ data: grades });
});
