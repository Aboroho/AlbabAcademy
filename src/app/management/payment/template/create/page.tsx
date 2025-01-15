"use client";

import PaymentTemplateDetailsForm from "@/components/forms/payment-template-form";

function CreatePaymentTemplate() {
  return (
    <div className="bg-white p-4 rounded-md">
      <PaymentTemplateDetailsForm formTitle="Create new payment template" />
    </div>
  );
}

export default CreatePaymentTemplate;
