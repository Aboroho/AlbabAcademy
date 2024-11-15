"use client";
import { IAuthContext, useAuth } from "@/hooks/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Dashboard() {
  const { user, isLogin } = useAuth() as IAuthContext;
  const router = useRouter();

  useEffect(() => {
    console.log(user, isLogin);
    if (!isLogin) {
      router.push("/login");
    } else if (user?.role === "ADMIN") {
      router.push("/dashboard/admin");
    }
  }, []);

  if (!isLogin) return null;

  return <div>Dashboard</div>;
}

export default Dashboard;
