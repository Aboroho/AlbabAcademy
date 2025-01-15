import { Protected } from "@/components/auth";
import PaymentSummary from "./payment-summary";
import Card from "@/components/ui/card";
import CountChart from "./count-chart";

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
          <div className="bg-white rounded-md p-4">
            <PaymentSummary />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-md p-4">
          <CountChart />
        </div>
      </div>
    </Protected>
  );
}

export default AdminDashboard;
