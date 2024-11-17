"use client";

import IconLink from "@/components/ui/IconLink";
import { HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { RiNotificationLine } from "react-icons/ri";

export default function CommonLinks() {
  const pathName = usePathname();
  return (
    <div className="flex flex-col gap-0.5">
      <IconLink
        label="Dashboard"
        icon={<HomeIcon className="w-4 h-4" />}
        href="/management/dashboard"
        active={pathName.startsWith("/management/dashboard")}
      />
      <IconLink
        label="Notice"
        icon={<RiNotificationLine className="w-4 h-4" />}
        href="/management/notice"
        active={pathName == "/management/notice"}
      />
    </div>
  );
}
