"use client";

import { api } from "@/client-actions/helper";
import {
  PaymentViewModel,
  StudentPaymentListViewModel,
  useGetStudentPaymentList,
} from "@/client-actions/queries/payment-queries";
import { Button } from "@/components/button";
import { SelectGradeField } from "@/components/forms/common-fields";
import StudentInvoice from "@/components/invoice/student-invoice";
import { Badge } from "@/components/shadcn/ui/badge";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { cn, formatDate } from "@/lib/utils";
import { PaymentStatus } from "@prisma/client";
import { pdf } from "@react-pdf/renderer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { isEmpty } from "lodash";
import { Download, WalletCards } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

function TableSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="w-full" key={index}>
          <Skeleton className="w-full h-10" />
        </div>
      ))}
    </div>
  );
}

type PaymentAction = {
  payment_id: number;
  payment_action: "PAID" | "FAILED";
};

function StudentPaymentList() {
  const form = useForm<{ grade_id: number }>({});
  const gradeId = form.watch("grade_id");
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "") || 1;
  const pageSize = 10;

  const filter = { page, pageSize, grade_id: gradeId };

  const queryClient = useQueryClient();
  const [lastModifiedPaymentId, setLastModifiedPaymentId] = useState<number>();
  const { data, isLoading, queryKey } = useGetStudentPaymentList({}, filter);
  const payments = data?.payments;
  const paymentsCount = data?.count;

  const paymentMutation = useMutation({
    mutationFn: async ({ payment_id, payment_action }: PaymentAction) => {
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
      const updatedPayment = paymentRes.data as PaymentViewModel;
      setLastModifiedPaymentId(updatedPayment.id);
      queryClient.invalidateQueries({ queryKey: ["student-payment"] });
      queryClient.setQueryData(
        queryKey,
        (oldPaymentList?: StudentPaymentListViewModel) => {
          if (isEmpty(oldPaymentList)) return;
          return {
            payments: updatePaymentStatus(
              oldPaymentList.payments,
              updatedPayment
            ),
            count: oldPaymentList.count,
          };
        }
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
      payment.payment_request?.forMonth +
      (payment.payment_request?.forYear
        ? "," + payment.payment_request.forYear
        : "");
    const invoice = (
      <StudentInvoice
        stipend={payment.payment_request?.stipend || 0}
        fees={payment.payment_fields}
        mobile={payment.student.user.phone}
        name={payment.student.full_name}
        studentCohort={payment.student.cohort.name}
        studentGrade={payment.student.grade.name}
        studentSection={payment.student.section.name}
        studentID={payment.student.student_id}
        forDate={forDate}
        paymentDetails={[{ amount: payment.amount, date: payment.created_at }]}
      />
    );

    const fileName = `invoice-${payment.payment_request?.title}-${payment.student.student_id}`;
    const blob = await pdf(invoice).toBlob();

    saveAs(blob, fileName);
  }

  function updatePaymentStatus(
    oldPayments: StudentPaymentListViewModel["payments"],

    updatedPayment: PaymentViewModel
  ): StudentPaymentListViewModel["payments"] {
    return oldPayments
      .map((payment) => {
        if (payment.id !== updatedPayment.id) return payment;
        return {
          ...payment,
          payment_status: updatedPayment.payment_status,
        };
      })
      .sort((pA) => (pA.id === updatedPayment.id ? -1 : 1));
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

  // if (isLoading) return <TableSkeleton />;
  return (
    <div className="w-full">
      <FormProvider {...form}>
        <div className="w-64 my-4">
          <SelectGradeField />
        </div>
      </FormProvider>
      <Table className="min-w-[1124px]">
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

        {!isLoading && payments && payments.length > 0 && (
          <TableBody>
            {payments?.map((payment, index) => (
              <TableRow
                key={payment.id}
                className={cn(
                  lastModifiedPaymentId === payment.id
                    ? payment.payment_status === "PAID"
                      ? ` bg-green-300 data-[state=selected]:bg-green-300 hover:bg-green-300`
                      : "bg-red-300 data-[state=selected]:bg-red-300  hover:bg-red-300"
                    : ""
                )}
              >
                <TableCell className="font-medium ">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className="font-medium ">
                  {payment.student.full_name}
                </TableCell>
                <TableCell>{payment.student.grade.name}</TableCell>
                <TableCell>{payment.student.section.name}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      getClassNameByPaymentStatus(payment.payment_status)
                    )}
                  >
                    {payment.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>{payment.payment_method}</TableCell>

                <TableCell className="text-right font-bold text-[17px]">
                  {payment.amount} <span className="text-2xl">৳</span>
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(payment.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(payment.update_at)}
                </TableCell>
                <TableCell className="text-right">
                  {payment.payment_request?.title}
                </TableCell>
                <TableCell className="text-right bg-green">
                  {["PROCESSING", "FAILED"].includes(
                    payment.payment_status
                  ) && (
                    <AlertDialog
                      onConfirm={() => markAsPaid(payment.id)}
                      confirmText="Mark payment as PAID"
                      confirmButtonClassName="bg-green-500"
                      message={
                        <>
                          Pay on behalf of{" "}
                          <span className="font-bold">
                            {payment.student.full_name},{" "}
                            {payment.student.grade.name},{" "}
                            {payment.student.section.name}
                          </span>
                        </>
                      }
                    >
                      <Button
                        className="bg-green-600 hover:bg-initial"
                        size="sm"
                      >
                        <WalletCards />
                        Mark as paid
                      </Button>
                    </AlertDialog>
                  )}

                  {payment.payment_status === "PAID" && (
                    <div className="flex gap-2 justify-end">
                      <AlertDialog
                        confirmText="Mark payment as FAILED?"
                        onConfirm={() => markAsFailed(payment.id)}
                        message={
                          <>
                            Reject payment -{" "}
                            <span className="font-bold">
                              {payment.student.full_name},{" "}
                              {payment.student.grade.name},{" "}
                              {payment.student.section.name}
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
        )}
      </Table>
      {!isLoading && isEmpty(payments) && (
        <div className="text-slate-500 text-center mt-10">No data found</div>
      )}
      {isLoading && <TableSkeleton />}
      <div className="mt-10">
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={paymentsCount || 0}
        />
      </div>
    </div>
  );
}

export default StudentPaymentList;
