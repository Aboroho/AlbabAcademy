import { NextRequest } from "next/server";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { apiResponse } from "../../utils/handleResponse";

import {
  authenticate,
  authorizeAdmin,
} from "@/app/api/middlewares/auth/auth_middlewares";
import { z } from "zod";
import { parseJSONData } from "../../utils/parseIncomingData";
import { prismaQ } from "../../utils/prisma";

const schema = z.object({
  group: z.string().optional(),
  media: z.array(
    z.object({
      url: z.string().min(1, "url required").url("Invalid url"),
      asset_id: z.string(),
    })
  ),
});

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req: NextRequest) => {
    const data = await parseJSONData(req);
    const parsedData = await schema.parseAsync(data);
    const refinedData = parsedData.media.map((data) => ({
      url: data.url,
      asset_id: data.asset_id,
      group: parsedData.group,
    }));

    await prismaQ.media.createMany({
      data: refinedData,
    });

    return apiResponse({ data: refinedData });
  }
);
