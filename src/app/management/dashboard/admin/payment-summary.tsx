"use client";

import { useGetPayments } from "@/client-actions/queries/payment-queries";

import { DateRangePicker } from "@/components/ui/date-range-picker";

import { useState } from "react";
import { DateRange } from "react-day-picker";

type Props = {};

function PaymentSummary({}: Props) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: payments } = useGetPayments(
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
      <h2 className="text-lg">Payment Analytics</h2>
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
        <span>Total: </span>
        <span>{total}</span>
      </div>
    </div>
  );
}

export default PaymentSummary;
