"use client";
import LoginComponent from "@/containers/common/login-component";
import { UiContext, useUiContext } from "@/hooks/UiContext";
import React from "react";

function TopNav() {
  const { ui } = useUiContext() as UiContext;
  return (
    <div className="bg-white p-4 w-full rounded-md flex">
      <div className="title">
        <h1>{ui.title}</h1>
      </div>
      <div className="ml-auto">
        <LoginComponent />
      </div>
    </div>
  );
}

export default TopNav;
