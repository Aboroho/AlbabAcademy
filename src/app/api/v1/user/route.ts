import { apiResponse } from "../../utils/handleResponse";
import { parseJSONData } from "../../utils/parseIncomingData";
import { userCreateValidationSchema } from "../../validationSchema/userSchema";
import { validateFileAndMove } from "../../utils/fileUploader";

import { prismaQ } from "../../utils/prisma";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { ApiRoute } from "@/types/common";

export const POST: ApiRoute = async (req, params) => {
  return await withMiddleware(async (req) => {
    const userData = await parseJSONData(req);

    // validation
    const parsedUserData = await userCreateValidationSchema.parseAsync(
      userData
    );

    // resolve given file url
    if (parsedUserData.avatar) {
      parsedUserData.avatar = await validateFileAndMove(parsedUserData.avatar, {
        size: { max: 10 * 1024 * 1024 },
        type: ["image/png", "image/jpeg"],
      });
    }

    const refinedData = {
      ...parsedUserData,
      role: "ADMIN" as const,
    };

    // insert into the database
    const newUser = await prismaQ.user.create({
      data: refinedData,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;

    return apiResponse({ data: userWithoutPassword, statusCode: 201 });
  })(req, params);
};
