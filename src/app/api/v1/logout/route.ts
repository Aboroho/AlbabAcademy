import { cookies } from "next/headers";
import { withError } from "../../utils/handleError";

import { NextResponse } from "next/server";

export const POST = withError(async () => {
  const cookieStore = cookies();
  cookieStore.delete("access_token");
  return NextResponse.json("logout successfull", { status: 200 });
});
