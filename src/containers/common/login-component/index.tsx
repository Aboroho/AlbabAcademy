"use client";

import { Button } from "@/components/button";
import { Popover, PopoverTrigger } from "@/components/shadcn/ui/popover";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { IAuthContext, useAuth } from "@/hooks/AuthProvider";
import { PopoverContent } from "@radix-ui/react-popover";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function LoginComponent() {
  const { isLogin, logOut, user, isLoading } = useAuth() as IAuthContext;

  function renderSkeleton() {
    return (
      <Skeleton className="w-10 h-10 rounded-full bg-slate-100"></Skeleton>
    );
  }

  return (
    <>
      {isLoading && renderSkeleton()}

      {!isLoading && (
        <>
          {!isLogin && (
            <Link href="/login">
              <Button
                variant="link"
                size="link"
                className="border-2 border-slate-100 hover:bg-primary text-primary-primary  px-4"
              >
                <LogIn className="w-4 h-4" /> Login
              </Button>
            </Link>
          )}

          {isLogin && (
            <>
              <Popover>
                <PopoverTrigger>
                  <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
                    <Image
                      src={
                        user?.avatar?.replace(/^\./, "") || "/images/avatar.png"
                      }
                      alt="user avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-4 text-primary">
                  <div className="bg-white px-4 py-2 shadow-md rounded-md flex flex-col gap-1 text-left">
                    <Link href="/dashboard">
                      <Button variant="link" size="link" className="text-left">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Button>
                    </Link>

                    <Button
                      variant="link"
                      size="link"
                      className="justify-start "
                      onClick={async () => await logOut()}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </>
      )}
    </>
  );
}
