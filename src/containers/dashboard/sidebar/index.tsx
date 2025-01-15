"use client";
import Image from "next/image";
import CommonLinks from "./common-links";
import Link from "next/link";

import { Bell, GraduationCap } from "lucide-react";
import {
  CollapsibleLink,
  CollapsibleLinkContent,
} from "@/components/ui/collapsible-link";
import { Protected } from "@/components/auth";

function Sidebar() {
  return (
    <div className="flex flex-col gap-3">
      <Link href={"/"}>
        <div className="flex items-center  pb-2">
          <Image
            src="/assets/images/logo_abstract.png"
            alt="albab logo"
            width={48}
            height={20}
          />
          <h2 className="text-lg font-semibold text-brand">Albab Academy</h2>
        </div>
      </Link>
      <CommonLinks />

      <Protected
        roles={["ADMIN", "DIRECTOR", "SUPER_ADMIN"]}
        action="redirect"
        redirectPath="/management/dashboard"
      >
        <CollapsibleLink
          icon={<GraduationCap className="w-4 h-4" />}
          label={"Student"}
          routePrefix="/management/students"
        >
          <CollapsibleLinkContent
            linkList={{
              links: [
                { label: "Student List", href: "" },
                { label: "Create student", href: "/create" },
                { label: "Payment summary", href: "/payments" },
                { label: " Payment request", href: "/payment-request" },
              ],
              prefix: "/management/students",
            }}
          />
        </CollapsibleLink>

        {/* student group */}
        <CollapsibleLink
          icon={<GraduationCap className="w-4 h-4" />}
          label={"Student Groups"}
          routePrefix="/management/groups"
        >
          <CollapsibleLinkContent
            linkList={{
              links: [
                { label: "Groups", href: "/" },
                { label: "Create Grade", href: "/grades/create" },
                { label: "Create Section", href: "/sections/create" },
                { label: "Create Cohort", href: "/cohorts/create" },
              ],
              prefix: "/management/groups",
            }}
          />
        </CollapsibleLink>

        <CollapsibleLink
          icon={<GraduationCap className="w-4 h-4" />}
          label={"Teacher"}
          routePrefix="/management/teachers"
        >
          <CollapsibleLinkContent
            linkList={{
              links: [
                { label: " Teacher's List", href: "" },
                { label: "Create teacher", href: "/create" },
              ],
              prefix: "/management/teachers",
            }}
          />
        </CollapsibleLink>

        <CollapsibleLink
          icon={<GraduationCap className="w-4 h-4" />}
          label={"Assessment"}
          routePrefix="/management/assessments"
        >
          <CollapsibleLinkContent
            linkList={{
              links: [
                { label: "Create Assessment", href: "/create" },
                { label: "Assessment List", href: "/list" },
              ],
              prefix: "/management/assessments",
            }}
          />
        </CollapsibleLink>

        <CollapsibleLink
          icon={<Bell className="w-4 h-4" />}
          label={"Manage Notice"}
          routePrefix="/management/manage-notice"
        >
          <CollapsibleLinkContent
            linkList={{
              links: [
                { label: "Create Notice", href: "/create" },
                {
                  label: "Notice List",
                  href: "/list",
                },
              ],
              prefix: "/management/manage-notice",
            }}
          />
        </CollapsibleLink>

        <CollapsibleLink
          icon={<GraduationCap className="w-4 h-4" />}
          label={"Manage Payment"}
          routePrefix="/management/payment"
        >
          <CollapsibleLinkContent
            linkList={{
              links: [
                { label: "Create Payment Template", href: "/template/create" },
                { label: " Payment Templates", href: "/template" },
                {
                  label: "Create Payment Request",
                  href: "/payment-request/create",
                },
              ],
              prefix: "/management/payment",
            }}
          />
        </CollapsibleLink>
      </Protected>
    </div>
  );
}

export default Sidebar;
