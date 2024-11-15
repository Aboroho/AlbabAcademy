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
        data: omitFields(parsedPaymentRequest, ["payment_targets"]),
      });

      if (["TEACHER", "STUDENT"].includes(paymentTargetType)) {
        const paymentInfo = paymentTargets
          .map((id) => ({
            user_id: id,
            payment_request_id: paymentRequest.id,
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

        const payments = await prismaQ.payment.createMany({
          data: paymentInfo,
        });
      } else {
        // structure
        let query: any = {
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

        const paymentInfo = studentUserIds.map((u) => ({
          user_id: u.user_id,
          payment_request_id: paymentRequest.id,
        }));
        await prismaQ.payment.createMany({
          data: paymentInfo,
        });
      }
    });

    return apiResponse({ data: paymentRequest });
  }
);
