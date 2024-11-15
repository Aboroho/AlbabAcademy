import { NextResponse } from "next/server";

export type APIResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
  description?: unknown;
};

export const apiResponse = (res: APIResponse) => {
  return NextResponse.json(
    {
      success: true,

      statusCode: res.statusCode || 200,
      ...(res.data ? { data: res.data } : {}),
      ...(res.description ? { description: res.description } : {}),
      ...(res.message ? { message: res.message } : {}),
    },
    { status: res.statusCode || 200 }
  );
};
