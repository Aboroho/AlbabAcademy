"use client";
import { Button } from "@/components/button";
import InputField from "@/components/ui/input-field";
import { Modal, ModalRefType } from "@/components/ui/modal/Modal";
import React, { useRef, useState } from "react";

type Props = {
  due: number;
  handlePayment: (amount: number, paymentReqId: number) => Promise<void>;
  paymentReqId: number;
  isLoading?: boolean;
  disabled?: boolean;
  description?: string;
};

function PaymentModal({
  due,
  handlePayment,
  disabled,
  paymentReqId,
  description,
}: Props) {
  const ref = useRef<ModalRefType>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  return (
    <div>
      <Modal
        ref={ref}
        title="Payment"
        description={description}
        trigger={
          <Button
            size="sm"
            disabled={due === 0}
            className="bg-green-600 mr-2 hover:bg-green-700 "
          >
            Pay Now
          </Button>
        }
      >
        <div className="flex flex-col gap-1">
          <div className="mb-4">
            Total payable amount is
            <span className="font-bold "> {due}</span> ৳
          </div>
          <InputField
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={paymentAmount}
            onChange={(e) =>
              setPaymentAmount(Math.min(parseInt(e.target.value), due))
            }
          />
          {paymentAmount <= 0 && (
            <div className="text-red-500">Invalide amount</div>
          )}
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={async () => {
              await handlePayment(paymentAmount, paymentReqId);
              ref.current?.close();
            }}
            disabled={paymentAmount <= 0 || disabled}
          >
            Pay Now
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default PaymentModal;
