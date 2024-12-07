"use client";
import Link from "next/link";
import { Navlink, topNavLinks } from "./top-nav-links";
import { buttonVariants } from "@/components/button";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import MobileMenu from "./mobile-menu";

import { Fragment } from "react";
import { ChevronDown, Facebook, Twitter } from "lucide-react";

import LogoDesktop from "@/assets/images/logo_desktop.png";
import Image from "next/image";
import { facebookUrl } from "../../../../constants/global";
import LoginComponent from "../../common/login-component";

function TopNav() {
  const pathName = usePathname();

  function renderDesktopDropdownElem(link: Navlink) {
    return (
      <Link
        href={link.path}
        key={link.path}
        className="block text-white hover:bg-primary w-full hover:text-white p-4 py-3.5 rounded-md  min-w-[18rem] last:mb-3 group/link duration-150 transition-colors"
      >
        <div className="label mb-1 tracking-wide text-black  group-hover/link:text-white ">
          {link.label}
        </div>
        <div className="description text-slate-500 group-hover/link:text-slate-200 h-fit whitespace-normal text-sm">
          Lorem ipsum dolor sit amet consectetur a
        </div>
      </Link>
    );
  }
  return (
    <nav className="sticky top-0 z-40 text-white bg-primary backdrop-blur-2xl transition-colors duration-500 z-100">
      <div className="px-6 md:px-8 lg:px-10">
        <div className="h-16 flex justify-between items-center">
          <div className="logo text-brand flex items-center gap-2">
            <Image src={LogoDesktop} alt="Albab academy logo" height={42} />
          </div>
          <div className="desktop-menu  space-x-1 hidden xl:flex">
            {topNavLinks.map((link) => {
              const activePath =
                link.activePrefix === link.path
                  ? pathName === link.path
                  : pathName.startsWith(link.activePrefix ?? "");
              return (
                <Fragment key={link.path}>
                  {/* Simple link wihout children (drop down content) */}
                  {!link.collapsible && (
                    <Link
                      href={link.path}
                      key={link.path}
                      className={cn(
                        buttonVariants({ variant: "link", size: "link" }),
                        "text-white",
                        activePath &&
                          "bg-white text-primary hover:bg-white/90 hover:text-primary"
                      )}
                    >
                      {link.icon} {link.label}
                    </Link>
                  )}

                  {/* dropdown */}
                  {link.collapsible && (
                    <div
                      key={link.path}
                      className={cn(
                        "group relative cursor-pointer",
                        buttonVariants({ variant: "link", size: "link" }),
                        "text-white",
                        pathName.startsWith(link.activePrefix ?? "") &&
                          "bg-white text-primary hover:bg-white/90 hover:text-primary"
                      )}
                    >
                      <div className="flex gap-2 items-center  min-w-full">
                        {link.icon} {link.label}
                        {link.collapsible && (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {link.collapsible && (
                          <div className="dropdown-wraper absolute left-1/2 -translate-x-1/2  max-h-fit  bg-transparent top-full pt-3 hidden group-hover:block  ">
                            <div className="drop-down-content pt-5 border-t-4 border-brand/40  animate-in  slide-in-from-bottom-2 fade-in-10 p-4 pb-0 text-primary  rounded-lg bg-white  shadow-lg">
                              {link.popoverTitle && (
                                <div className="dropdown-title flex items-center mb-2  gap-2">
                                  {link.popOverIcon && (
                                    <div className="w-8 h-8 bg-brand/60 text-white rounded-full flex items-center justify-center">
                                      {link.popOverIcon}
                                    </div>
                                  )}
                                  <h3 className="text-lg">
                                    {link.popoverTitle}
                                  </h3>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <div className="left flex-1">
                                  {link.children
                                    ?.filter((_, index) => index % 2 == 0)
                                    .map((child) => (
                                      <Fragment key={child.path}>
                                        {renderDesktopDropdownElem(child)}
                                      </Fragment>
                                    ))}
                                </div>
                                <div className="right flex-1  ">
                                  {link.children
                                    ?.filter((_, index) => index % 2 == 1)
                                    .map((child) => (
                                      <Fragment key={child.path}>
                                        {renderDesktopDropdownElem(child)}
                                      </Fragment>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="social-menu hidden lg:flex gap-6">
            <div className="social-links flex gap-4">
              <Link
                href={facebookUrl}
                target="_blank"
                className="text-sm flex gap-2 items-center"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="" className="text-sm flex gap-2 items-center">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
            <LoginComponent />
          </div>
          <div className="mobile-links xl:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
