import {
  authenticate,
  authorizeTeacherAndAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { withMiddleware } from "@/app/api/middlewares/withMiddleware";
import { apiResponse } from "@/app/api/utils/handleResponse";
import { parseJSONData } from "@/app/api/utils/parseIncomingData";
import { prismaQ } from "@/app/api/utils/prisma";
import { expenseValidationSchema } from "@/app/api/validationSchema/expenseSchema";

export const GET = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req, { params }) => {
    const expense = await prismaQ.expense.findUnique({
      where: {
        id: parseInt(params.expenseId),
      },
    });
    if (!expense) throw new Error("Expense not found");
    return apiResponse({
      data: expense,
    });
  }
);
export const DELETE = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req, { params }) => {
    const expense = await prismaQ.expense.delete({
      where: {
        id: parseInt(params.expenseId),
      },
    });
    return apiResponse({
      data: expense,
    });
  }
);

export const PATCH = withMiddleware(
  authenticate,
  authorizeTeacherAndAdmin,
  async (req, { params }) => {
    const data = await parseJSONData(req);
    const parsedData = await expenseValidationSchema.parseAsync(data);

    const _expense = await prismaQ.expense.findUnique({
      where: {
        id: parseInt(params.expenseId),
      },
    });
    if (!_expense) throw new Error("Expense not found");
    const expense = await prismaQ.expense.update({
      data: parsedData,
      where: {
        id: parseInt(params.expenseId),
      },
    });
    return apiResponse({
      data: expense,
    });
  }
);
