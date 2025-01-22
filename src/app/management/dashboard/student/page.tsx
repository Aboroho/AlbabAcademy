import { Protected } from "@/components/auth";
import PaymentSummary from "../payment-summary";
import { BellIcon } from "lucide-react";
import Announcements from "../announcement";

export default function StudentDashboard() {
  return (
    <Protected redirectPath="/login" roles={["STUDENT"]} action="redirect">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-5 w-full lg:w-[60%] flex-col">
          <div className="bg-white rounded-md p-4">
            <PaymentSummary />
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-white rounded-md p-4">
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
