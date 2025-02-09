import {
  authenticate,
  authorizeTeacherAndAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";
import { expenseValidationSchema } from "../../validationSchema/expenseSchema";

export const POST = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req) => {
    const data = await parseJSONData(req);
    const parsedData = await expenseValidationSchema.parseAsync(data);

    const expense = await prismaQ.expense.create({
      data: parsedData,
    });
    return apiResponse({
      data: expense,
    });
  }
);

export const GET = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req) => {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    // // join filters

    const page = parseInt(searchParams.get("page") || "") || 1;
    const pageSize = parseInt(searchParams.get("pageSize") || "") || 50;
    const expenses = await prismaQ.expense.findMany({
      where: {
        ...(startDate &&
          endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const count = await prismaQ.expense.count({
      where: {
        ...(startDate &&
          endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      },
    });
    return apiResponse({
      data: {
        expenses,
        count,
      },
    });
  }
);
