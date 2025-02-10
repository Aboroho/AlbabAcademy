import { authenticate } from "@/app/api/middlewares/auth/auth_middlewares";
import { getAuthSession } from "@/app/api/middlewares/auth/helper";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { APIError } from "@/app/api/utils/handleError";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { prismaQ } from "@/app/api/utils/prisma";

export const GET = withMiddleware(authenticate, async (req) => {
  const searchParams = Object.fromEntries(new URL(req.nextUrl).searchParams);
  const startDate = new Date(searchParams["start"]);
  const endDate = new Date(searchParams["end"] || new Date());

  const session = await getAuthSession();
  if (!session?.user) throw new APIError("Server auth error");
  const userId = parseInt(session.user.id);
  const role = session.user.role;

  const payments = await prismaQ.payment.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(role !== "ADMIN" && { user_id: userId }),
    },
    include: {
      user: {
        select: {
          id: true,
          avatar: true,
          role: true,

          student: {
            select: {
              full_name: true,
              guardian_phone: true,
            },
          },
          teachers: {
            select: {
              full_name: true,
              designation: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const paymentRequestEntry = await prismaQ.paymentRequestEntry.aggregate({
    _sum: {
      amount: true,
      stipend: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(role !== "ADMIN" && { user_id: userId }),
    },
  });

  let expenses;
  if (role === "ADMIN") {
    expenses = await prismaQ.expense.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
  return apiResponse({
    data: {
      payments,
      totalRequestedAmount: paymentRequestEntry._sum.amount,
      totalStipend: paymentRequestEntry._sum.stipend,
      expenses,
    },
  });
});
