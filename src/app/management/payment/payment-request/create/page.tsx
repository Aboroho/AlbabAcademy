import PaymentRequestForm from "@/components/forms/payment-request-form";

function CreatePaymentRequest() {
  return (
    <div className="mx-auto max-w-[768px]">
      <PaymentRequestForm formTitle="Create Payment Request" />
    </div>
  );
}

export default CreatePaymentRequest;
