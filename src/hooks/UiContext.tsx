"use client";
import { createContext, useContext, useState } from "react";

export type UiData = {
  title: string;
  sideBarStatus: boolean;
};

export type UiContext = {
  ui: UiData;
  updateUi: (data: UiData) => void;
};

const uiContext = createContext<UiContext | null>(null);

export const UiContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ui, setUi] = useState<UiData>({
    title: "",
    sideBarStatus: false,
  });

  const updateUi = (data: UiData) => {
    setUi((prev) => {
      return { ...prev, ...data };
    });
  };

  return (
    <uiContext.Provider value={{ ui, updateUi }}>{children}</uiContext.Provider>
  );
};

export const useUiContext = () => {
  return useContext(uiContext);
};
