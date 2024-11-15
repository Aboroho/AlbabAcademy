import { Middleware } from "../withMiddleware";
import { APIError } from "../../utils/handleError";
import { cookies } from "next/headers";
import { verifyToken } from "../../utils/jwt";

export const authenticate: Middleware = async (req, params, next) => {
  const cookieStore = cookies();
  const accessTokenData = cookieStore.get("access_token");

  if (!accessTokenData) throw new APIError("No access token provided", 401);

  const { value: accessToken } = accessTokenData;

  try {
    const user = await verifyToken(accessToken);
    req.headers.set("x-user", JSON.stringify(user));
    next();
  } catch (err) {
    console.log(err);
    throw new APIError("You are not logged in", 407);
  }
};

export const authorizeAdmin: Middleware = async (req, params, next) => {
  const userData = req.headers.get("x-user");
  if (!userData)
    throw new APIError("Operation not permitted, unauthorized", 403);

  const user = await JSON.parse(userData);
  if (user?.role !== "ADMIN")
    throw new APIError("Operation not permitted, unauthorized", 403);

  next();
};

export const authorizeTeacherAndAdmin: Middleware = async (
  req,
  params,
  next
) => {
  const userData = req.headers.get("x-user");

  if (!userData)
    throw new APIError("Operation not permitted, unauthorized", 403);

  const user = await JSON.parse(userData);

  if (user?.role !== "TEACHER" && user?.role !== "ADMIN")
    throw new APIError("Operation not permitted, unauthorized", 403);

  next();
};
