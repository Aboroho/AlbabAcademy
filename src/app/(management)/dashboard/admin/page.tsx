import { Protected } from "@/hooks/AuthProvider";
import React from "react";

function AdminDashboard() {
  return (
    <Protected redirectPath="/login" roles={["ADMIN"]} action="redirect">
      <div>AdminDashboard</div>
    </Protected>
  );
}

export default AdminDashboard;
