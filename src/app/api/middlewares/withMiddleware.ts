import { NextRequest } from "next/server";
import { withError } from "../utils/handleError";

export type Middleware = (
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
  next: () => void
) => void | Response | Promise<void | Response>;

export const withMiddleware = (...middlewares: Middleware[]) => {
  return async (req: NextRequest, params: Record<string, unknown>) => {
    let call = true;

    const next = () => {
      call = true;
    };
    let res: ReturnType<Middleware> | undefined;

    for (const m of middlewares) {
      if (!call) return res;
      call = false;
      res = await withError(m)(req, params, next);
    }
    if (res) return res;
  };
};
