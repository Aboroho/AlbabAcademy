import { cookies } from "next/headers";
import { comparePassword } from "../../utils/encryption";
import { APIError, withError } from "../../utils/handleError";
import { apiResponse } from "../../utils/handleResponse";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";

export const POST = withError(async (req) => {
  const data = await parseJSONData(req);
  const { username, password } = data;

  if (!username) throw new APIError("Username is required", 400);
  if (!password) throw new APIError("Password is required!", 400);

  const user = await prismaQ.user.findUnique({
    where: {
      username,
    },
  });
  console.log(username, password, user);

  if (!user || !(await comparePassword(password, user.password)))
    throw new APIError("username or password is incorrect!", 400);

  const { username: _username, role, phone, email, avatar, id } = user;

  const accessToken = generateAccessToken({ username: _username, role, id });
  const refreshToken = generateRefreshToken({ username: _username, role, id });

  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
    sameSite: "strict",
  });

  return apiResponse({
    data: {
      username: _username,
      role,
      phone,
      email,
      avatar,
      accessToken,
      refreshToken,
    },
  });
});
