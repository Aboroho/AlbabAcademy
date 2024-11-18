import React from "react";
import StudentPaymentList from "./payment-list";

function StudentPayments() {
  return (
    <div>
      <h1 className="text-lg mb-8">Student's Payment History</h1>
      <StudentPaymentList />
    </div>
  );
}

export default StudentPayments;
