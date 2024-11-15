import { cookies } from "next/headers";

import { NextResponse } from "next/server";

import { withMiddleware } from "../../middlewares/withMiddleware";
import { ApiRoute } from "@/types/common";

export const POST: ApiRoute = async (req, params) => {
  return await withMiddleware(async () => {
    const cookieStore = cookies();
    cookieStore.delete("access_token");
    return NextResponse.json("logout successfull", { status: 200 });
  })(req, params);
};
