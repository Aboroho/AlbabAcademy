"use client";
import Loader from "@/components/ui/skeleton/loader";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Dashboard() {
  const session = useSession();
  const user = session.data?.user;
  const isLogedIn = session.status === "authenticated";
  const isLoading = session.status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (!isLogedIn || !user) {
      router.push("/login");
    } else if (user?.role === "ADMIN") {
      router.push("dashboard/" + user.role.toLowerCase());
    }
  }, [isLogedIn, router, user]);

  if (isLoading) return <Loader />;
  if (!isLogedIn) return null;

  return <div>Dashboard</div>;
}

export default Dashboard;
