import { Middleware } from "../withMiddleware";
import { APIError } from "../../utils/handleError";

import { getAuthSession } from "./helper";

export const authenticate: Middleware = async (req, params, next) => {
  const session = await getAuthSession();

  if (!session) throw new APIError("You are not allowed to access", 401);

  return next();
};

export const authorizeAdmin: Middleware = async (req, params, next) => {
  const session = await getAuthSession();

  if (!session)
    throw new APIError("Operation not permitted, unauthorized", 403);

  if (session.user?.role !== "ADMIN")
    throw new APIError("Operation not permitted, unauthorized", 403);

  next();
};

export const authorizeTeacherAndAdmin: Middleware = async (
  req,
  params,
  next
) => {
  const session = await getAuthSession();

  if (!session)
    throw new APIError("Operation not permitted, unauthorized", 403);

  if (session.user?.role !== "TEACHER" && session?.user?.role !== "ADMIN")
    throw new APIError("Operation not permitted, unauthorized", 403);

  next();
};
