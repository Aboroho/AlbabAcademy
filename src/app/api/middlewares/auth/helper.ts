import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}
