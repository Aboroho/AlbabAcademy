import {
  authenticate,
  authorizeAdmin,
} from "../../middlewares/auth/auth_middlewares";
import { withMiddleware } from "../../middlewares/withMiddleware";
import { v2 as cloudinary } from "cloudinary";

export const POST = withMiddleware(
  authenticate,
  authorizeAdmin,
  async (req) => {
    const body = (await req.json()) as { paramsToSign: string[] };
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,

      process.env.CLOUDINARY_API_SECRET!
    );

    return Response.json({ signature });
  }
);
