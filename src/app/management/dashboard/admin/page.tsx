import { Protected } from "@/components/auth";

function AdminDashboard() {
  return (
    <Protected redirectPath="/login" roles={["ADMIN"]} action="redirect">
      <div>AdminDashboard</div>
    </Protected>
  );
}

export default AdminDashboard;
