"use client";
import { Role } from "@prisma/client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../ui/skeleton/loader";

type ProtectedProps = {
  children: React.ReactNode;
  roles?: Array<Role>;
  redirectPath?: string;
  action: "redirect" | "hide" | "warning" | "allow";
};
export const Protected = ({
  children,
  roles,
  redirectPath = "/login",
  action = "redirect",
}: ProtectedProps) => {
  // const { isLogin, user, isLoading } = useAuth() as IAuthContext;
  const session = useSession();
  const user = session.data?.user;
  const isLogedIn = session.status === "authenticated";
  const isLoading = session.status === "loading";

  //   console.log("d", user, isLogedIn, isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isLogedIn || !user || !roles?.includes(user.role)) {
      if (action === "redirect" && !isLoading) router.push(redirectPath);
    }
  }, [action, isLogedIn, redirectPath, roles, router, user, isLoading]);

  if (isLoading) return <Loader />;

  if (!isLogedIn || !user || !roles?.includes(user.role)) {
    if (action === "hide") return null;
    if (action === "warning")
      return <div>You are not allowed to perform this action!!</div>;
    return null;
  }

  return <>{children}</>;
};
