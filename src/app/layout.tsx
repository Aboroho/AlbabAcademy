"use client";

import { SessionProvider } from "next-auth/react";
import "./global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UiContextProvider } from "@/hooks/UiContext";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <UiContextProvider>
          <html lang="en">
            <body>
              <ProgressBar
                height="4px"
                color="purple"
                options={{ showSpinner: false }}
                shallowRouting
              />
              {children}
            </body>
          </html>
        </UiContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
