import Sidebar from "@/containers/dashboard/sidebar";
import TopNav from "@/containers/dashboard/topnav";
import { Protected } from "@/components/auth";
import { Toaster } from "react-hot-toast";

import React from "react";
import { EdgeStoreProvider } from "@/lib/edgestore";

type Props = { children: React.ReactNode };

function DashboardLayout({ children }: Props) {
  return (
    <Protected
      roles={["ADMIN", "STUDENT", "TEACHER"]}
      action="redirect"
      redirectPath="/login"
    >
      <Toaster />
      <EdgeStoreProvider>
        <div className="flex ">
          {/* left sidebar */}
          <aside className="@container w-[15%] min-w-[300px] max-w-[500px] h-screen sticky top-0 flex-auto hidden lg:block ">
            <div className=" h-full">
              <div className="border p-4 h-full  overflow-y-hidden hover:overflow-y-auto bg-white">
                <Sidebar />
              </div>
            </div>
          </aside>

          <div className="w-full flex flex-col gap-2 flex-auto bg-slate-50">
            {/* header */}
            <header className="@container h-30 sticky top-0 z-50 bg-slate-50 ">
              <div className="p-2 lg:px-4">
                <div className="w-full overflow-hidden ">
                  {/* header component */}
                  <TopNav />
                </div>
              </div>
            </header>

            {/* main */}
            <main className="@container bg-slate-50 ">
              <div className="px-2 lg:px-4  overflow-auto">
                <div className="w-full h-auto overflow-auto  min-h-screen   pt-6 rounded-md">
                  <div className=" min-h-64">{children}</div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </EdgeStoreProvider>
    </Protected>
  );
}

export default DashboardLayout;
