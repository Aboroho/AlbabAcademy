import { NextRequest, NextResponse } from "next/server";
import { Middleware } from "../middlewares/withMiddleware";
import { ZodError, ZodIssue } from "zod";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

function prismaErrorMapper(err: PrismaClientKnownRequestError) {
  const target = err.meta?.target;
  const errors = {
    Student_student_id_key: {
      student_id: {
        message: "Student ID must be unique",
      },
    },
    Student_roll_cohort_id_key: {
      roll: {
        message: "Roll must be unique, given roll exist in the selected cohort",
      },
    },
    User_email_key: {
      email: {
        message: "Email must be unique",
      },
    },
  };

  if (errors.hasOwnProperty(target as keyof typeof errors)) {
    return errors[target as keyof typeof errors];
  }
  return {};
}

export class APIError extends Error {
  public statusCode: number;
  public errorDetails?: unknown;

  constructor(message: string, statusCode = 500, errorDetails?: unknown) {
    super(message);
    this.name = this.constructor.name; // Set the error name
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;

    // Ensure the error class instance is correctly recognized
    Object.setPrototypeOf(this, APIError.prototype);

    // Capture the stack trace to aid debugging
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.errorDetails ? { errorDetails: this.errorDetails } : {}),
    };
  }
}

export const withError = (handler: Middleware) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: NextRequest, param: any, next: () => void) => {
    try {
      return await handler(req, param, next);
    } catch (e: unknown) {
      if (e instanceof APIError) {
        // handle general error
        return NextResponse.json(e.toJSON(), { status: e.statusCode });
      } else if (e instanceof ZodError) {
        // handle validation errors

        const formattedError = formatZodError(e.issues);
        return NextResponse.json(
          {
            success: false,
            statusCode: 400,
            message: "Fix the errors",
            errorDetails: formattedError,
          },
          { status: 400 }
        );
      }
      // handle not inside middleware error
      else if (e instanceof TypeError && /is not a function/.test(e.message)) {
        e.message = "`next` can not be called outside of withMiddleware";
        throw e;
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        let err = new APIError("Server error!!", 400, {
          errCode: e.code,
          details: e.meta?.target,
        });
        console.log(err);

        if (e.code === "P2002") {
          err = new APIError(
            "Unique validation failed",
            400,
            prismaErrorMapper(e)
          );
        }

        return NextResponse.json(err.toJSON(), { status: err.statusCode });
      } else {
        console.log(e);
        // handle unknown server side error
        return NextResponse.json({
          success: false,
          message: "Some unknown error occured",
        });
      }
    }
  };
};

export const formatZodError = (errors: ZodIssue[]) => {
  return errors.reduce((aggr, cur) => {
    const field = cur.path.join(".");

    aggr[field] = {
      message: cur.message,
    };

    return aggr;
  }, {} as { [key: string | number]: unknown });
};
