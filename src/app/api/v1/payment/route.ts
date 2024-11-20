import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { APIError } from "../../utils/handleError";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";

// update payment status
export const PUT = withMiddleware(authenticate, authorizeAdmin, async (req) => {
  const { payment_id, payment_action } = await parseJSONData(req);

  if (!payment_id) throw new APIError("No payment_id provide", 400);
  if (!payment_action) throw new APIError("No action found");

  if (["PAID", "FAILED"].includes(payment_action)) {
    const payment = await prismaQ.payment.update({
      where: {
        id: payment_id as number,
      },
      data: {
        status: payment_action,
      },
    });

    if (payment.status === payment_action && payment.id === payment_id)
      return apiResponse({
        data: {
          ...payment,
          payment_status: payment.status,
        },
      });

    throw new APIError("Some error occured in the server side", 500);
  }

  throw new APIError("Unknow action provide, must be `PAY` or `FAIL`", 400);
});
