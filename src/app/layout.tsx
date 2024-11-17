"use client";

import { SessionProvider } from "next-auth/react";
import "./global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </QueryClientProvider>
    </SessionProvider>
  );
}
