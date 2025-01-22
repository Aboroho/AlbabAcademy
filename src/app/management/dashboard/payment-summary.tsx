"use client";

import { useGetPaymentAnalytics } from "@/client-actions/queries/payment-queries";
import { Skeleton } from "@/components/shadcn/ui/skeleton";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { formatDate } from "@/lib/utils";
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

  const { data: payments, isLoading } = useGetPaymentAnalytics(
    {},
    {
      startDate: date?.from,
      endDate: date?.to,
    }
  );

  const total =
    payments?.reduce(
      (acc, payment) =>
        payment.status === "PAID" ? acc + payment.amount : acc,
      0
    ) || 0;
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
      <div>
        <div className="text-green-500 text-2xl py-4">Total : {total} ৳</div>
      </div>

      <div>
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
          {payments?.map((payment) => (
            <tr className="border-b  " key={payment.id}>
              <td>
                {payment.user.avatar && (
                  <Image
                    alt="Avatar"
                    width={50}
                    height={50}
                    src={payment.user.avatar}
                  />
                )}
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
      </div>
    </div>
  );
}

export default PaymentSummary;
