"use client";

import { api } from "@/client-actions/helper";
import {
  StudentPaymentResponse,
  useGetStudentPayments,
} from "@/client-actions/queries/payment-queries";
import { Button } from "@/components/button";
import StudentInvoice from "@/components/invoice/student-invoice";
import { Badge } from "@/components/shadcn/ui/badge";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@prisma/client";
import { pdf } from "@react-pdf/renderer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { Download, WalletCards } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

function TableSkeleton() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index} className="p-10">
            <TableCell className="font-medium p-4">
              <Skeleton className="h-6 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-32" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-6 w-24" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-6 w-24" />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function StudentPaymentList() {
  const [page] = useState(1);
  const queryClient = useQueryClient();
  const [lastModifiedPaymentId, setLastModifiedPaymentId] = useState<number>();
  const { data: payments, isLoading } = useGetStudentPayments({}, { page });

  const paymentMutation = useMutation({
    mutationFn: async ({
      payment_id,
      payment_action,
    }: {
      payment_id: number;
      payment_action: "PAID" | "FAILED";
    }) => {
      return await api("/payment", {
        method: "PUT",
        body: JSON.stringify({
          payment_id,
          payment_action,
        }),
      });
    },
    onSuccess(paymentRes) {
      if (!paymentRes.success) return false;
      const payment = paymentRes.data as StudentPaymentResponse;
      setLastModifiedPaymentId(payment.id);
      queryClient.setQueryData(
        ["student-payments"],
        (oldData: StudentPaymentResponse[]) =>
          updatePaymentStatus(oldData, payment.id, payment.status)
      );
    },
  });

  function getClassNameByPaymentStatus(status: PaymentStatus) {
    if (status === "PAID") return "bg-green-600 text-white hover:bg-initail";
    if (status === "PROCESSING")
      return "bg-orange-600 text-white hover:bg-initial";
    return "bg-red-600 hover:bg-initial";
  }

  async function downloadInvoice(id: number) {
    const payment = payments?.find((payment) => payment.id === id);
    if (!payment) return;

    const forDate =
      payment.for_month + (payment.for_year ? "," + payment.for_year : "");
    const invoice = (
      <StudentInvoice
        fees={payment.payment_fields}
        mobile={payment.student.phone}
        name={payment.student.full_name}
        studentCohort={payment.student.cohort_name}
        studentGrade={payment.student.grade_name}
        studentSection={payment.student.section_name}
        studentID={payment.student.student_id}
        forDate={forDate}
      />
    );

    const fileName = `invoice-${payment.payment_request_title}-${payment.student.student_id}`;
    const blob = await pdf(invoice).toBlob();

    saveAs(blob, fileName);
  }

  function updatePaymentStatus(
    payments: StudentPaymentResponse[],
    paymentId: number,
    status: PaymentStatus
  ) {
    console.log(payments, paymentId, status);
    if (!Array.isArray(payments)) return false;
    return payments.map((payment) => {
      if (payment.id !== paymentId) return payment;
      return {
        ...payment,
        status: status,
      };
    });
  }

  async function markAsPaid(paymentId: number) {
    toast.loading("Payment processing", { id: "payment" });
    const res = await paymentMutation.mutateAsync({
      payment_action: "PAID",
      payment_id: paymentId,
    });
    toast.dismiss("payment");
    if (res.success) {
      toast.success("Payment status marked as paid");
    } else {
      toast.error(res.message);
    }
  }

  async function markAsFailed(paymentId: number) {
    toast.loading("Payment rejecting...", { id: "payment" });
    const res = await paymentMutation.mutateAsync({
      payment_action: "FAILED",
      payment_id: paymentId,
    });
    toast.dismiss("payment");
    if (res.success) {
      toast.success("Mark status marked as failed");
    } else {
      toast.error(res.message);
    }
  }

  function formatDate(inputDate: string | Date): string {
    const date = new Date(inputDate);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate
      .replace(",", "")
      .replace("AM", "AM")
      .replace("PM", "PM");
  }

  console.log(lastModifiedPaymentId);

  if (isLoading) return <TableSkeleton />;
  return (
    <div className="w-full">
      <Table className="min-w-[1124px]">
        <TableCaption>Student payments List. </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-6">SL</TableHead>
            <TableHead className="">Student Name</TableHead>
            <TableHead className="">Grade</TableHead>
            <TableHead className="">Section</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Issue Date</TableHead>
            <TableHead className="text-center">Last Update</TableHead>
            <TableHead className="text-right">Payment Request</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment, index) => (
            <TableRow
              key={payment.id}
              className={cn(
                lastModifiedPaymentId === payment.id
                  ? payment.status === "PAID"
                    ? ` bg-green-300 data-[state=selected]:bg-green-300 hover:bg-green-300`
                    : "bg-red-300 data-[state=selected]:bg-red-300  hover:bg-red-300"
                  : ""
              )}
            >
              <TableCell className="font-medium ">{index + 1}</TableCell>
              <TableCell className="font-medium ">
                {payment.student.full_name}
              </TableCell>
              <TableCell>{payment.student.grade_name}</TableCell>
              <TableCell>{payment.student.section_name}</TableCell>
              <TableCell>
                <Badge
                  className={cn(getClassNameByPaymentStatus(payment.status))}
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{payment.paymentMethod}</TableCell>

              <TableCell className="text-right font-bold text-[17px]">
                {payment.payment_fields?.reduce(
                  (prev, cur) => prev + cur.amount,
                  0
                )}{" "}
                <span className="text-2xl">৳</span>
              </TableCell>
              <TableCell className="text-right">
                {formatDate(payment.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                {formatDate(payment.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                {payment.payment_request_title}
              </TableCell>
              <TableCell className="text-right bg-green">
                {["PROCESSING", "FAILED"].includes(payment.status) && (
                  <AlertDialog
                    onConfirm={() => markAsPaid(payment.id)}
                    confirmText="Mark payment as PAID"
                    confirmButtonClassName="bg-green-500"
                    message={
                      <>
                        Pay on behalf of{" "}
                        <span className="font-bold">
                          {payment.student.full_name},{" "}
                          {payment.student.grade_name},{" "}
                          {payment.student.section_name}
                        </span>
                      </>
                    }
                  >
                    <Button className="bg-green-600 hover:bg-initial" size="sm">
                      <WalletCards />
                      Mark as paid
                    </Button>
                  </AlertDialog>
                )}

                {payment.status === "PAID" && (
                  <div className="flex gap-2 justify-end">
                    <AlertDialog
                      confirmText="Mark payment as FAILED?"
                      onConfirm={() => markAsFailed(payment.id)}
                      message={
                        <>
                          Reject payment -{" "}
                          <span className="font-bold">
                            {payment.student.full_name},{" "}
                            {payment.student.grade_name},{" "}
                            {payment.student.section_name}
                          </span>
                        </>
                      }
                    >
                      <Button className="bg-red-600 hover:bg-" size="sm">
                        Mark as failed
                      </Button>
                    </AlertDialog>
                    <Button
                      className=""
                      size="sm"
                      onClick={() => downloadInvoice(payment.id)}
                    >
                      <Download />
                      Invoice
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StudentPaymentList;
