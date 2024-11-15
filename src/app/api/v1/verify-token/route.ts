import { cookies } from "next/headers";
import { isLoggedin } from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";
import { APIError, withError } from "../../utils/handleError";
import { verifyToken } from "../../utils/jwt";
import { prismaQ } from "../../utils/prisma";

export const POST = withError(async () => {
  const cookieStore = await cookies();
  const accessTokenData = cookieStore.get("access_token");

  if (!accessTokenData) throw new APIError("No access token provided", 401);

  const { value: accessToken } = accessTokenData;

  try {
    const userDetails = (await verifyToken(accessToken)) as {
      username: string;
    };
    const username = userDetails.username;
    const user = await prismaQ.user.findUnique({
      select: {
        username: true,
        phone: true,
        email: true,
        role: true,
        avatar: true,
      },

      where: {
        username,
      },
    });
    return apiResponse({ data: user });
  } catch (err) {
    console.log(err);
    throw new APIError("You are not logged in", 407);
  }
});
