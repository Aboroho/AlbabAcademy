"use client";

import IconLink from "@/components/ui/IconLink";
import { HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { AiOutlineExperiment } from "react-icons/ai";
import { RiNotificationLine } from "react-icons/ri";

export default function CommonLinks() {
  const pathName = usePathname();
  return (
    <div className="flex flex-col gap-0.5">
      <IconLink
        label="Dashboard"
        icon={<HomeIcon className="w-4 h-4" />}
        href="/dashboard"
        active={pathName.startsWith("/dashboard")}
      />
      <IconLink
        label="Notice"
        icon={<RiNotificationLine className="w-4 h-4" />}
        href="/notice"
        active={pathName == "/notice"}
      />
      <IconLink
        label="Playground"
        icon={<AiOutlineExperiment className="w-4 h-4" />}
        href="/playground"
        active={pathName == "/playground"}
      />
    </div>
  );
}
