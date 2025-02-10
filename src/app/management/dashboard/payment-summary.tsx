"use client";

import { useGetPaymentAnalytics } from "@/client-actions/queries/payment-queries";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { formatDate } from "@/lib/utils";
import { TabsContent } from "@radix-ui/react-tabs";
import { isEmpty } from "lodash";
import Image from "next/image";

import { useState } from "react";
import { DateRange } from "react-day-picker";

type Props = {};

function PaymentSummary({}: Props) {
  const now = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    to: new Date(),
  });

  const { data: analytics, isLoading } = useGetPaymentAnalytics(
    {},
    {
      startDate: date?.from,
      endDate: date?.to,
    }
  );

  const payments = analytics?.payments;
  const totalExpense = analytics?.expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const totalPaid =
    payments?.reduce(
      (acc, payment) =>
        payment.status === "PAID" ? acc + payment.amount : acc,
      0
    ) || 0;

  const totalRequested = analytics?.totalRequestedAmount || 0;
  const totalStipend = analytics?.totalStipend || 0;

  function renderExpense() {
    return (
      <div className="max-h-[70vh] overflow-y-scroll">
        <table className="w-full mb-14">
          <thead>
            <th className="text-left">Title</th>
            <th>Amount</th>
            <th className="text-right p-3">Date</th>
          </thead>

          {isLoading && (
            <>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
            </>
          )}

          {analytics?.expenses?.map((expense) => (
            <tr className="border-b  h-[65px]" key={expense.id}>
              <td className=" p-3 flex gap-4 items-center">{expense.title}</td>
              <td className="text-center p-3 text-green-500 font-bold">
                {expense.amount} ৳
              </td>
              <td className="text-right p-3">
                {formatDate(expense.createdAt)}
              </td>
            </tr>
          ))}
        </table>
        {!isLoading && isEmpty(payments) && (
          <div className="text-sm text-gray-500 mb-10 text-center">
            No data found
          </div>
        )}
      </div>
    );
  }

  function renderPayments() {
    return (
      <div className="max-h-[70vh] overflow-y-scroll">
        <table className="w-full mb-14">
          <thead>
            <th className="text-left">Avatar</th>
            <th className=" p-3 text-left">Name</th>
            <th>Amount</th>
            <th className="text-right p-3">Date</th>
          </thead>

          {isLoading && (
            <>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
            </>
          )}

          {payments?.map((payment) => (
            <tr className="border-b  h-[65px]" key={payment.id}>
              <td>
                <Image
                  className="w-[50px] h-[50px] rounded-full border"
                  alt="Avatar"
                  width={50}
                  height={50}
                  src={
                    payment.user.avatar || "/assets/images/student-avatar.png"
                  }
                />
              </td>
              <td className=" p-3 flex gap-4 items-center">
                {payment.user.student?.full_name ||
                  payment.user.teacher?.full_name ||
                  "------"}
              </td>
              <td className="text-center p-3 text-green-500 font-bold">
                {payment.amount} ৳
              </td>
              <td className="text-right p-3">
                {formatDate(payment.createdAt)}
              </td>
            </tr>
          ))}
        </table>
        {!isLoading && isEmpty(payments) && (
          <div className="text-sm text-gray-500 mb-10 text-center">
            No data found
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-lg mb-2 font-semibold">Payment Analytics</h2>
      <DateRangePicker
        onUpdate={(values) =>
          setDate({ from: values.range.from, to: values.range.to })
        }
        initialDateFrom={date?.from}
        initialDateTo={date?.to}
        align="start"
        locale="en-GB"
        showCompare={false}
      />
      <div className="flex gap-4 py-4">
        <div className="bg-orange-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
          Requested Amount <span className="text-xl">{totalRequested}৳</span>
        </div>

        <div className="bg-gray-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
          Stipend Given <span className="text-xl">{totalStipend}৳</span>
        </div>
        <div className="bg-green-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
          Paid <span className="text-xl">{totalPaid}৳</span>
        </div>
        <div className="bg-red-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
          Due{" "}
          <span className="text-xl">
            {totalRequested - totalStipend - totalPaid}৳
          </span>
        </div>
        <div className="bg-red-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
          Expenses <span className="text-xl">{totalExpense}৳</span>
        </div>
      </div>

      <Tabs defaultValue="payment">
        <TabsList className="mb-4">
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
        </TabsList>
        <TabsContent value="payment">{renderPayments()}</TabsContent>
        <TabsContent value="expense">{renderExpense()}</TabsContent>
      </Tabs>
    </div>
  );
}

export default PaymentSummary;
