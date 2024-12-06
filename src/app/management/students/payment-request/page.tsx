"use client";

import { api } from "@/client-actions/helper";
import {
  PaymentRequestEntryViewModel,
  useGetPaymentRequestEntry,
} from "@/client-actions/queries/payment-queries";
import { Button } from "@/components/button";
import { Accordion } from "@/components/shadcn/ui/accordion";
import { Badge } from "@/components/shadcn/ui/badge";
import InputField from "@/components/ui/input-field";
import { Modal, ModalRefType } from "@/components/ui/modal/Modal";
import { cn, formatDate } from "@/lib/utils";
import { Payment } from "@prisma/client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { pdf } from "@react-pdf/renderer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { DownloadIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import StudentInvoice from "@/components/invoice/student-invoice";

type Props = {};

function StudentPaymentRequest({}: Props) {
  const { data: paymentRequests } = useGetPaymentRequestEntry(
    {},
    { target: "student" }
  );

  const [paymentAmount, setPaymentAmount] = useState(0);
  const [lastModifiedPaymentRequestId, setLastModifiedPaymentRequestId] =
    useState<number>();
  const [lastModifiedPaymentId, setLastModifiedPaymedId] = useState<number>();
  const [page] = useState(1);
  const [pageSize] = useState(50);

  const paymentModalRef = useRef<ModalRefType>(null);

  const queryClient = useQueryClient();

  const paymentMutation = useMutation({
    mutationFn: async ({
      payment_request_entry_id,
      amount,
    }: {
      payment_request_entry_id: number;
      amount: number;
    }) => {
      return await api("/payment", {
        method: "POST",
        body: JSON.stringify({
          payment_request_entry_id,
          amount,
        }),
      });
    },
    onSuccess(paymentRes) {
      if (!paymentRes.success || isEmpty(paymentRes.data)) return false;
      const payment = paymentRes.data as Payment;
      setLastModifiedPaymentRequestId(
        payment.payment_request_entry_id as number
      );
      setLastModifiedPaymedId(payment.id);
      queryClient.invalidateQueries({
        queryKey: ["payment-requests-entry", "student", page, pageSize],
      });
      queryClient.setQueryData(
        ["payment-requests-entry", "student", page, pageSize],
        (oldPaymentEntries?: PaymentRequestEntryViewModel[]) => {
          if (isEmpty(oldPaymentEntries)) return;
          return oldPaymentEntries?.map((entries) => {
            if (entries.id === payment.payment_request_entry_id)
              entries.payments.push(payment);
            return entries;
          });
        }
      );
    },
  });

  async function handleDownloadInvoice(id: number) {
    const paymentRequest = paymentRequests?.find((pr) => pr.id === id);
    if (!paymentRequest) return;

    const forDate =
      paymentRequest.payment_request?.forMonth +
      (paymentRequest.payment_request?.forYear
        ? "," + paymentRequest.payment_request.forYear
        : "");
    const invoice = (
      <StudentInvoice
        fees={paymentRequest.payment_details}
        mobile={paymentRequest.user.phone}
        name={paymentRequest.user.student?.full_name || ""}
        studentCohort={paymentRequest.user.student?.cohort.name || ""}
        studentGrade={
          paymentRequest.user.student?.cohort.section.grade.name || ""
        }
        studentSection={paymentRequest.user.student?.cohort.section.name || ""}
        studentID={paymentRequest.user.student?.student_id || ""}
        forDate={forDate}
        paymentDetails={paymentRequest.payments
          .filter((p) => p.status === "PAID")
          .map((p) => ({ amount: p.amount, date: p.createdAt }))}
      />
    );

    const fileName = `invoice-${paymentRequest.payment_request?.title}-${paymentRequest.user.student?.student_id}`;
    const blob = await pdf(invoice).toBlob();

    saveAs(blob, fileName);
  }

  async function handlePayment(payment_request_entry_id: number) {
    toast.loading("Payment processing...", { id: "payment" });
    try {
      await paymentMutation.mutateAsync({
        payment_request_entry_id,
        amount: paymentAmount,
      });
      toast.success("Payment successfull");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      toast.dismiss("payment");
      paymentModalRef.current?.close();
    }
  }

  return (
    <div className="max-w-[1536px] overflow-auto max-h-[750px]">
      <div className="w-[1636px] relative">
        <div className="grid grid-cols-11 text-center font-semibold pb-2 border-b sticky">
          <div>Name</div>
          <div>Group</div>
          <div>Roll</div>
          <div>Payment Request</div>
          <div>Amount to pay</div>
          <div>Stipend</div>
          <div>Paid amount</div>
          <div>Payment due</div>
          <div>Issue Date</div>
          <div>Payment status</div>
          <div>Action</div>
        </div>

        <Accordion type="multiple">
          {paymentRequests?.map((pr) => {
            const paidAmount = pr.payments
              .filter((p) => p.status === "PAID")
              .reduce((sum, cur) => cur.amount + sum, 0);
            const due = pr.amount - paidAmount - pr.stipend;
            const paymentStatus = (
              due === 0 ? "paid" : due === pr.amount ? "unpaid" : "partial"
            ).toUpperCase();
            const paymentStatusClass =
              paymentStatus === "PAID"
                ? "bg-green-600 hover:bg-green-700"
                : paymentStatus === "UNPAID"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-orange-600 hover:bg-yellow-700";
            return (
              <AccordionItem
                value={pr.id.toString()}
                key={pr.id}
                className={cn(
                  "my-6  rounded-md bg-gray-100 px-4  border-2 border-slate-300",
                  lastModifiedPaymentRequestId === pr.id &&
                    "bg-slate-200 border-2 border-yellow-500"
                )}
              >
                <AccordionTrigger asChild={true}>
                  <div
                    key={pr.id}
                    className="grid grid-cols-11 py-4 pr-2 hover:bg-slate-200 cursor-pointer rounded-md text-center border-b border-gray-300"
                  >
                    <div>{pr.user.student?.full_name}</div>
                    <div className="">
                      <Badge>
                        {" "}
                        {pr.user.student?.cohort.section.grade.name}
                      </Badge>
                      <br />
                      <Badge>{pr.user.student?.cohort.section.name}</Badge>
                      <br />
                      <Badge>{pr.user.student?.cohort.name}</Badge>
                    </div>
                    <div>{pr.user.student?.roll}</div>
                    <div>{pr.payment_request.title}</div>
                    <div className="font-bold">{pr.amount}৳</div>
                    <div className="font-bold">{pr.stipend}৳</div>
                    <div className="font-bold">{paidAmount} ৳</div>
                    <div className="font-bold">
                      {due === 0 ? "-" : due + "৳"}{" "}
                    </div>
                    <div>{formatDate(pr.createdAt)}</div>
                    <div>
                      <Badge className={paymentStatusClass}>
                        {paymentStatus}
                      </Badge>
                    </div>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex gap-1 justify-center"
                    >
                      <Modal
                        ref={paymentModalRef}
                        title="Payment"
                        description={`Payment for ${pr.user.student?.full_name}, [${pr.user.student?.cohort.section.grade.name}]`}
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
                        <div>
                          Total payable amount is
                          <span className="font-bold "> {due}</span> ৳
                        </div>
                        <InputField
                          label="Amount"
                          type="number"
                          placeholder="Enter amount"
                          value={paymentAmount}
                          onChange={(e) =>
                            setPaymentAmount(
                              Math.min(parseInt(e.target.value), due)
                            )
                          }
                        />
                        {paymentAmount <= 0 && (
                          <div className="text-red-500">Invalide amount</div>
                        )}
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handlePayment(pr.id)}
                          disabled={
                            paymentAmount <= 0 || paymentMutation.isPending
                          }
                        >
                          Pay Now
                        </Button>
                      </Modal>

                      <Button
                        size="sm"
                        className=""
                        disabled={paidAmount === 0}
                        onClick={() => handleDownloadInvoice(pr.id)}
                      >
                        <DownloadIcon />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-2 py-4 ">
                  <div className="flex">
                    <div className="w-[60%] left border-r border-gray-400">
                      <h2 className="text-lg p-2 pb-4 font-semibold">
                        Payment Summary
                      </h2>

                      <div className="max-w-[868px] grid grid-cols-5 text-center font-bold pb-2 border-b">
                        <div className="font-bold">SL</div>
                        <div className="font-bold">Amount</div>
                        <div>Payment Date</div>
                        <div>Payment Status</div>
                        <div>Payment method</div>
                      </div>
                      {pr.payments.length === 0 && (
                        <div className="text-center text-slate-400 max-w-[868px] py-4">
                          No payment found
                        </div>
                      )}
                      {pr.payments.map((payment, index) => (
                        <div
                          key={payment.id}
                          className={cn(
                            "max-w-[868px] grid grid-cols-5 text-center  py-1",
                            lastModifiedPaymentId === payment.id &&
                              "border border-green-500"
                          )}
                        >
                          <div className="font-bold">{index + 1}.</div>
                          <div className="font-bold text-green-700">
                            {payment.amount} ৳
                          </div>
                          <div>{formatDate(payment.createdAt)}</div>
                          <div>
                            <Badge
                              className={
                                payment.status === "PAID"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-red-500 hover:bg-red-500"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          <div className="text-sm font-semibold">
                            {payment.paymentMethod}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pl-6 flex-1">
                      <h2 className="text-lg p-2 pb-4 font-semibold">
                        Payment Details
                      </h2>

                      <div className=" grid grid-cols-2 text-center font-bold pb-2 border-b">
                        <div className="font-bold">Details</div>
                        <div>Amount</div>
                      </div>

                      {pr.payment_details.map((pd) => (
                        <div
                          key={pd.details}
                          className=" grid grid-cols-2 text-center  py-1"
                        >
                          <div>{pd.details}</div>
                          <div className="font-bold">{pd.amount} ৳</div>
                        </div>
                      ))}

                      <div className="grid grid-cols-2 my-2 pt-2 border-t">
                        <div></div>
                        <div className="text-center">
                          Total :{" "}
                          {pr.payment_details.reduce(
                            (sum, cur) => sum + cur.amount,
                            0
                          )}{" "}
                          ৳
                        </div>
                        <div></div>
                        <div className="text-center border-b py-1 text-blue-700">
                          Stipend :- {pr.stipend}৳
                        </div>
                        <div></div>
                        <div className="text-center font-bold text-green-700">
                          Payable :{" "}
                          {pr.payment_details.reduce(
                            (sum, cur) => sum + cur.amount,
                            0
                          ) - pr.stipend}
                          ৳
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

export default StudentPaymentRequest;
