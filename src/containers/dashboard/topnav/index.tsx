"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/shadcn/ui/drawer";
import LoginComponent from "@/containers/common/login-component";

import { MenuIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";

import { usePathname } from "next/navigation";

function TopNav() {
  // const { ui, updateUi } = useUiContext() as UiContext;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathName = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathName]);
  function handleMobileSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }
  return (
    <div className="bg-white p-4 px-6 w-full rounded-md flex items-center">
      <div className="mobile lg:hidden ">
        <Drawer
          direction="left"
          onOpenChange={handleMobileSidebar}
          open={isSidebarOpen}
        >
          <DrawerTrigger>
            <MenuIcon className="w-6 h-6 text-black" />
          </DrawerTrigger>
          <DrawerContent className="bg-white flex flex-col rounded-t-[10px] h-full w-[360px] mt-24 fixed bottom-0 right-0 overflow-y-auto pl-2 pt-4">
            <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>
            <DrawerDescription className="sr-only">Main menu</DrawerDescription>
            <Sidebar />
          </DrawerContent>
        </Drawer>
      </div>
      <div className="ml-auto">
        <LoginComponent />
      </div>
    </div>
  );
}

export default TopNav;
