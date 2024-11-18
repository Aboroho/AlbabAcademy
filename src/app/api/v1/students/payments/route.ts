import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { omitFields } from "@/app/api/utils/excludeFields";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";
import { flattenObject } from "@/lib/utils";

export const GET = withMiddleware(authenticate, authorizeAdmin, async () => {
  const data = await prismaQ.payment.findMany({
    where: {
      payment_request: {
        payment_target_type: {
          in: ["GRADE", "COHORT", "SECTION", "STUDENT"],
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },

    include: {
      user: {
        select: {
          phone: true,
          student: {
            select: {
              full_name: true,
              student_id: true,
              user_id: true,
              cohort: {
                select: {
                  id: true,
                  name: true,
                  section: {
                    select: {
                      id: true,
                      name: true,
                      grade: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      payment_request: {
        select: {
          forMonth: true,
          forYear: true,
          title: true,
          payment_template: {
            select: {
              template_fields: true,
            },
          },
        },
      },
    },
  });

  const transfomedData = data.map((payment) => ({
    ...omitFields(payment, ["payment_request", "user"]),
    student: {
      phone: payment.user.phone,
      ...(payment.user.student ? flattenObject(payment.user.student, "") : {}),
    },
    for_month: payment.payment_request.forMonth,
    for_year: payment.payment_request.forYear,
    payment_request_title: payment.payment_request.title,
    payment_fields: payment.payment_request.payment_template.template_fields,
  }));

  return apiResponse({ data: transfomedData });
});
