import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { omitFields } from "@/app/api/utils/excludeFields";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { paymentRequestCreateValidationSchema } from "@/app/api/validationSchema/paymentSchema";
import { Role } from "@prisma/client";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const paymentRequestData = await parseJSONData(req);
    const parsedPaymentRequest =
      await paymentRequestCreateValidationSchema.parseAsync(paymentRequestData);

    const paymentTargetType = parsedPaymentRequest.payment_target_type;
    const paymentTargets = parsedPaymentRequest.payment_targets;

    // transaction
    const paymentRequest = await prismaQ.$transaction(async (prismaQ) => {
      const paymentRequest = await prismaQ.paymentRequest.create({
        data: omitFields(parsedPaymentRequest, [
          "payment_targets",
          "payment_details",
          "stipend",
        ]),
      });

      const amount = parsedPaymentRequest.payment_details.reduce(
        (sum, cur) => sum + cur.amount,
        0
      );

      let targetsUsers: Array<number>;
      if (["TEACHER", "STUDENT"].includes(paymentTargetType)) {
        targetsUsers = paymentTargets;
      } else {
        // structure
        const query: any = {
          cohort: {
            section: {},
          },
        };

        // Modify query
        if (paymentTargetType === "GRADE") {
          query.cohort.section.grade_id = { in: paymentTargets };
        } else if (paymentTargetType === "SECTION") {
          query.cohort = {
            section_id: {
              in: paymentTargets,
            },
          };
        } else {
          query.cohort_id = {
            in: paymentTargets,
          };
        }

        const studentUserIds = await prismaQ.student.findMany({
          where: query,
          select: {
            user_id: true,
          },
        });

        targetsUsers = studentUserIds.map((st) => st.user_id);
      }

      const paymentRequestEntries = targetsUsers
        .map((userId) => ({
          user_id: userId,
          payment_request_id: paymentRequest.id,
          amount: amount,
          stipend: parsedPaymentRequest.stipend,
          payment_details: parsedPaymentRequest.payment_details,
        }))
        .filter(
          (target, index, self) =>
            // Check if there is any previous occurrence of the same pair to resolve the multiple payment issue
            index ===
            self.findIndex(
              (t) =>
                t.user_id === target.user_id &&
                t.payment_request_id === target.payment_request_id
            )
        );

      await prismaQ.paymentRequestEntry.createMany({
        data: paymentRequestEntries,
      });
    });

    return apiResponse({ data: paymentRequest });
  }
);

export const GET = withMiddleware(authenticate, authorizeAdmin, async (req) => {
  const { searchParams } = new URL(req.url);

  // // join filters
  const target = searchParams.get("target");
  const page = parseInt(searchParams.get("page") || "") || 1;
  const pageSize = parseInt(searchParams.get("pageSize") || "") || 50;

  const [paymentRequestList, count] = await prismaQ.$transaction([
    prismaQ.paymentRequestEntry.findMany({
      include: {
        payment_request: true,
        payments: true,

        user: {
          select: {
            // _count : true,
            username: true,
            id: true,
            phone: true,
            email: true,
            ...(target === "student"
              ? {
                  student: {
                    select: {
                      student_id: true,
                      id: true,
                      roll: true,
                      full_name: true,
                      cohort: {
                        select: {
                          name: true,
                          section: {
                            select: {
                              name: true,
                              grade: {
                                select: {
                                  name: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                }
              : {
                  teachers: {
                    select: {
                      full_name: true,
                      id: true,
                      designation: true,
                    },
                  },
                }),
          },
        },
      },

      where: {
        ...(target && {
          user: {
            role: target.toUpperCase() as Role,
          },
        }),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prismaQ.paymentRequestEntry.count({
      where: {
        ...(target && {
          user: {
            role: target.toUpperCase() as Role,
          },
        }),
      },
    }),
  ]);

  return apiResponse({ data: { count, entries: paymentRequestList } });
});
