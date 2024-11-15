"use client";
import { Button, buttonVariants } from "@/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/shadcn/ui/drawer";
import { ChevronDown, Facebook, MenuIcon, Twitter, X } from "lucide-react";
import React, { Fragment } from "react";
import { Navlink, topNavLinks } from "./top-nav-links";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Collapsible from "@/components/collapsible";
import { facebookUrl } from "../../../../constants/global";
import LogoAbstract from "@/assets/images/logo_abstract.png";
import Image from "next/image";
import LoginComponent from "../../common/login-component";

function MobileMenu() {
  const pathName = usePathname();

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
            <div className="pt-2 pl-4">{handleCollapsible(child)}</div>
          </Fragment>
        ))}
      </Collapsible>
    );
  }
  return (
    <div>
      <Drawer direction="left">
        <DrawerTrigger>
          <MenuIcon className="w-6 h-6 text-white" />
        </DrawerTrigger>
        <DrawerContent className="bg-accent flex flex-col rounded-t-[10px] h-full w-[360px] mt-24 fixed bottom-0 right-0">
          <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>
          <DrawerDescription className="sr-only">Main menu</DrawerDescription>
          <div className="px-3  flex justify-between">
            <div className="flex gap-1 items-center">
              <Image src={LogoAbstract} alt="albab academy logo" />
              <h1 className="text-brand text-lg">Albab Academy</h1>
            </div>
            <DrawerClose>
              <X className="w-4 h-4" />
            </DrawerClose>
          </div>
          <div className="flex flex-col justify-start gap-2 p-4 overflow-y-auto h-full">
            {topNavLinks.map((link) => (
              <Fragment key={link.path}>
                {!link.collapsible && renderMenuItem(link)}

                {link.collapsible && handleCollapsible(link)}
              </Fragment>
            ))}

            <LoginComponent />
            <div className="social-links flex gap-3 justify-center mt-auto">
              <Link
                target="_blank"
                href={facebookUrl}
                className="text-sm flex gap-2 items-center"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="" className="text-sm flex gap-2 items-center">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default MobileMenu;
