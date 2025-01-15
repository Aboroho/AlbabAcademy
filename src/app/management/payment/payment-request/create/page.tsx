import PaymentRequestForm from "@/components/forms/payment-request-form";

function CreatePaymentRequest() {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className=" max-w-[968px] ">
        <PaymentRequestForm formTitle="Create Payment Request" />
      </div>
    </div>
  );
}

export default CreatePaymentRequest;
