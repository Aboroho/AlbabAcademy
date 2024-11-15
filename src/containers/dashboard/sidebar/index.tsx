"use client";
import Image from "next/image";
import CommonLinks from "./common-links";
import Link from "next/link";

import { GraduationCap } from "lucide-react";
import {
  CollapsibleLink,
  CollapsibleLinkContent,
} from "@/components/ui/collapsible-link";

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
      <CollapsibleLink
        icon={<GraduationCap className="w-4 h-4" />}
        label={"Student"}
        routePrefix="/students"
      >
        <CollapsibleLinkContent
          linkList={{
            links: [
              { label: "Student List", href: "" },
              { label: "Create student", href: "/create" },
            ],
            prefix: "/students",
          }}
        />
      </CollapsibleLink>

      {/* student group */}
      <CollapsibleLink
        icon={<GraduationCap className="w-4 h-4" />}
        label={"Student Groups"}
        routePrefix="/groups"
      >
        <CollapsibleLinkContent
          linkList={{
            links: [
              { label: "Create Grade", href: "/grades/create" },
              { label: "Create Section", href: "/sections/create" },
              { label: "Create Cohort", href: "/cohorts/create" },
            ],
            prefix: "/groups",
          }}
        />
      </CollapsibleLink>

      <CollapsibleLink
        icon={<GraduationCap className="w-4 h-4" />}
        label={"Teacher"}
        routePrefix="/teachers"
      >
        <CollapsibleLinkContent
          linkList={{
            links: [{ label: "Create teacher", href: "/create" }],
            prefix: "/teachers",
          }}
        />
      </CollapsibleLink>

      <CollapsibleLink
        icon={<GraduationCap className="w-4 h-4" />}
        label={"Assessment"}
        routePrefix="/assessments"
      >
        <CollapsibleLinkContent
          linkList={{
            links: [
              { label: "Create Assessment", href: "/create" },
              { label: "Assessment List", href: "/list" },
            ],
            prefix: "/assessments",
          }}
        />
      </CollapsibleLink>

      <CollapsibleLink
        icon={<GraduationCap className="w-4 h-4" />}
        label={"Manage Payment"}
        routePrefix="/payment"
      >
        <CollapsibleLinkContent
          linkList={{
            links: [
              { label: "Create Payment Template", href: "/template/create" },
              {
                label: "Create Payment Request",
                href: "/payment-request/create",
              },
            ],
            prefix: "/payment",
          }}
        />
      </CollapsibleLink>
    </div>
  );
}

export default Sidebar;
