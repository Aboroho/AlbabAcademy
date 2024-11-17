import { apiResponse } from "../../utils/handleResponse";
import { APIError, withError } from "../../utils/handleError";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = withError(async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new APIError("No access token provided", 401);
  }

  return apiResponse({ data: session.user });
});
