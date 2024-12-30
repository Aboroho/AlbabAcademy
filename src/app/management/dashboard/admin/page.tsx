import { Protected } from "@/components/auth";
import PaymentSummary from "./payment-summary";

function AdminDashboard() {
  return (
    <Protected redirectPath="/login" roles={["ADMIN"]} action="redirect">
      <div className="">
        <PaymentSummary />
      </div>
    </Protected>
  );
}

export default AdminDashboard;
