import { ChevronDownIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import IconLink from "./IconLink";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

type Props = {
  label: string;
  children: React.ReactNode;
  icon?: JSX.Element;
  routePrefix?: string;
};
export const CollapsibleLink = ({
  label,
  children,
  icon,
  routePrefix,
}: Props) => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(
    !routePrefix ? false : pathName.startsWith(routePrefix)
  );

  const contentRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    } else {
      contentRef.current.style.height = "0px";
    }
  }, [isOpen]);

  return (
    <div className="">
      <div onClick={toggleMenu}>
        <IconLink
          active={routePrefix ? pathName.startsWith(routePrefix) : false}
          selected={isOpen}
          label={label}
          icon={icon}
          rightIcon={
            <ChevronDownIcon
              className={cn(
                "w-4 h-4 -rotate-90 transition-transform",
                isOpen && "rotate-0"
              )}
            />
          }
        />
      </div>

      <div
        className="h-0 overflow-hidden transition-all duration-200"
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};

type CollapsibleLinkContentProps = {
  linkList: {
    prefix: string;
    links: { label: string; href: string }[];
  };
};

export function CollapsibleLinkContent({
  linkList,
}: CollapsibleLinkContentProps) {
  const pathName = usePathname();
  return (
    <div className="pl-6 text-sm font-semibold text-zinc-600 pb-4 ">
      <div className="border-l border-gray-300 pl-3 flex flex-col gap-0.5 pt-2">
        {linkList.links.map((linkItem) => (
          <div
            className="relative after:block after:absolute  after after:-left-3 after:w-3 after:top-1/2 after:border  after:border-gray-300"
            key={linkItem.href}
          >
            <IconLink
              href={linkList.prefix + linkItem.href}
              label={linkItem.label}
              selected={pathName == linkList.prefix + linkItem.href}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
