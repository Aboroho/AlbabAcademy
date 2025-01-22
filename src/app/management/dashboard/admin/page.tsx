import { Protected } from "@/components/auth";
import PaymentSummary from "../payment-summary";
import Card from "@/components/ui/card";
import CountChart from "./count-chart";
import Announcements from "../announcement";
import AttendanceChart from "../attendance";
import FinanceChart from "../financeChart";
import { BellIcon } from "lucide-react";

function AdminDashboard() {
  return (
    <Protected redirectPath="/login" roles={["ADMIN"]} action="redirect">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-5 w-full lg:w-[60%] flex-col">
          <div className="flex  gap-5 ">
            <Card value="Students" count={100} />
            <Card value="Teacher" count={100} />
            <Card value="Staff" count={100} />
          </div>
          <div className="bg-white h-[400px]">
            <AttendanceChart />
          </div>
          <div className="bg-white h-[400px]">
            <FinanceChart />
          </div>
          <div className="bg-white rounded-md p-4">
            <PaymentSummary />
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-md p-4">
          <div className="h-[400px]">
            <CountChart />
          </div>
          <hr></hr>
          <div className="mt-8">
            <h2 className="flex gap-2 text-xl mb-6 items-center">
              <BellIcon />
              Announcement
            </h2>
            <Announcements />
          </div>
        </div>
      </div>
    </Protected>
  );
}

export default AdminDashboard;
