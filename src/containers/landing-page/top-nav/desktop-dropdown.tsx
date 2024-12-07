"use client";

import { Navlink } from "./top-nav-links";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { Button, buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import Collapsible from "@/components/collapsible";

type Props = {
  link: Navlink;
  asLink?: boolean;
};

function DesktopDropDown({ link }: Props) {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const timeOutRef = useRef<ReturnType<typeof setTimeout>>();
  function handleOpen() {
    setOpen(!open);
  }

  function handleEnter() {
    clearTimeout(timeOutRef.current);
    setOpen(true);
  }
  function handleLeave() {
    timeOutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  }

  function renderMenuItem(link: Navlink, isButton = false) {
    const attr = {
      className: cn(
        buttonVariants({ variant: "link", size: "link" }),
        "justify-start border-b w-full hover:bg-gray-300 hover:text-primary",

        pathName.startsWith(link.activePrefix ?? "") &&
          "bg-primary text-primary-foreground"
      ),
    };

    return isButton ? (
      <Button variant="link" size="link" {...attr}>
        {link.icon}
        {link.label}
        <ChevronDown className="w-4 h-4 ml-auto" />
      </Button>
    ) : (
      <Link href={link.path} {...attr}>
        {link.icon}
        {link.label}
      </Link>
    );
  }

  function handleCollapsible(link: Navlink) {
    if (!link.collapsible) return renderMenuItem(link);

    return (
      <Collapsible trigger={renderMenuItem(link, true)}>
        {link?.children?.map((child) => (
          <Fragment key={child.path}>
            <div className="pl-4 pt-1">{handleCollapsible(child)}</div>
          </Fragment>
        ))}
      </Collapsible>
    );
  }

  const activePath =
    link.activePrefix === link.path
      ? pathName === link.path
      : pathName.startsWith(link.activePrefix ?? "");

  return (
    <Popover onOpenChange={handleOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          variant="link"
          size="link"
          className={cn(
            activePath || (open && " bg-primary text-primary-foreground")
          )}
        >
          {link.icon} {link.label}
          <ChevronDown className="w-2 h-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="-mt-4  bg-transparent "
      >
        <div className="p-2 pb-4  min-w-[250px] max-w-[360px] w-fit bg-white  shadow-sm  border flex  flex-col mt-5 rounded-sm">
          {link?.children &&
            link.children.map((child) => (
              <Fragment key={child.path}>
                {child.collapsible && handleCollapsible(child)}
                {!child.collapsible && renderMenuItem(child)}
              </Fragment>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DesktopDropDown;
