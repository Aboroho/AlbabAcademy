import { Button } from "@/components/button";
import Link from "next/link";
import React from "react";

type Props = {};

function PreLogin({}: Props) {
  return (
    <div className="h-[400px]">
      <div className="h-full w-full flex justify-center items-center gap-4 flex-col">
        <div className="flex flex-col gap-4">
          <Link href="/login?mode=student">
            <Button className="px-16 py-8 bg-red-400">Student Login </Button>
          </Link>

          <Link href="/login?mode=teacher">
            <Button className="px-16 py-8 bg-blue-400">Teacher Login </Button>
          </Link>

          <Link href="/login?mode=admin" className="flex-1">
            <Button className="px-16 py-8 w-full bg-green-500">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PreLogin;
