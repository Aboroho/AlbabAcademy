"use client";
import { AuthProvider } from "@/hooks/AuthProvider";
import "./global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </QueryClientProvider>
    </AuthProvider>
  );
}
