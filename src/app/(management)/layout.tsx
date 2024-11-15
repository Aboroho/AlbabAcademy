import Sidebar from "@/containers/dashboard/sidebar";
import TopNav from "@/containers/dashboard/topnav";
import { Protected } from "@/hooks/AuthProvider";
import { Toaster } from "react-hot-toast";

import React from "react";
import { UiContextProvider } from "@/hooks/UiContext";

type Props = { children: React.ReactNode };

function DashboardLayout({ children }: Props) {
  return (
    <UiContextProvider>
      <Protected
        roles={["ADMIN", "STUDENT", "TEACHER"]}
        action="redirect"
        redirectPath="/login"
      >
        <Toaster />
        <div className="flex ">
          {/* left sidebar */}
          <aside className="@container w-[15%] min-w-[300px] max-w-[500px] h-screen sticky top-0 flex-auto hidden lg:block">
            <div className=" h-full">
              <div className="border p-4 h-full  overflow-y-hidden hover:overflow-y-auto bg-white">
                <Sidebar />
              </div>
            </div>
          </aside>

          <div className="w-full flex flex-col gap-4 flex-auto bg-slate-50">
            {/* header */}
            <header className="@container h-30 sticky top-0 z-50  ">
              <div className="pl-8 pr-10 pt-6 pb-0 ">
                <div className="w-full overflow-hidden ">
                  {/* header component */}
                  <TopNav />
                </div>
              </div>
            </header>

            {/* main */}
            <main className="@container bg-white">
              <div className="pl-8 py-4 pr-4 overflow-auto">
                <div className="w-full h-auto overflow-auto">
                  <div className=" min-h-64">{children}</div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </Protected>
    </UiContextProvider>
  );
}

export default DashboardLayout;
