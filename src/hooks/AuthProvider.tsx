"use client";

import { User } from "@/types/common";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/constants";

export type ILoginData = {
  username: string;
  password: string;
};

export type IAuthContext = {
  loginAction: (loginData: ILoginData) => Promise<boolean>;
  user: User | null;
  logOut: () => Promise<void>;
  isLogin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<IAuthContext | null>(null);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function validateUser() {
    const url = "http://localhost:3000/api/v1/verify-token";
    try {
      const res = await fetch(url, {
        method: "post",
      });

      const data = await res.json();

      if (!data.success) {
        return false;
      } else {
        const { username, role, phone, email, avatar } = data.data;

        setUser({
          username,
          role,
          phone,
          email,
          avatar,
        });
        setIsLogin(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    validateUser();
  }, [isLogin]);

  const loginAction = async (loginData: ILoginData): Promise<boolean> => {
    const { username, password } = loginData;
    console.log(loginData);
    const url = BASE_URL + "/api/v1/login";
    try {
      const res = await fetch(url, {
        method: "post",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        return false;
      } else {
        const { refreshToken, username, role, phone, email, avatar } =
          data.data;

        localStorage.setItem("refresh_token", refreshToken);

        setUser({
          username,
          role,
          phone,
          email,
          avatar,
        });

        setIsLogin(true);
        localStorage.setItem("token", "dkfakdfj");
        return true;
      }
    } catch (err: unknown) {
      console.log(err);
      return false;
    }
  };

  const logOut = async () => {
    const url = "api/v1/logout";
    try {
      const res = await fetch(url, { method: "post" });

      if (res.status === 200) {
        localStorage.removeItem("token");
        setUser(null);

        setIsLogin(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, loginAction, logOut, isLogin, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

type ProtectedProps = {
  children: React.ReactNode;
  roles?: Array<User["role"]>;
  redirectPath?: string;
  action: "redirect" | "hide" | "warning" | "allow";
};
export const Protected = ({
  children,
  roles,
  redirectPath = "/login",
  action = "redirect",
}: ProtectedProps) => {
  const { isLogin, user, isLoading } = useAuth() as IAuthContext;

  const router = useRouter();

  useEffect(() => {
    if (!isLogin || !user || !roles?.includes(user.role)) {
      if (action === "redirect" && !isLoading) router.push(redirectPath);
    }
  }, [action, isLogin, redirectPath, roles, router, user, isLoading]);

  if (isLoading) return <div>Loading</div>;

  if (!isLogin || !user || !roles?.includes(user.role)) {
    if (action === "hide") return null;
    if (action === "warning")
      return <div>You are not allowed to perform this action!!</div>;
    return null;
  }

  return <>{children}</>;
};
