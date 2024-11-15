import toast from "react-hot-toast";
import {
  IPaymentTemplateCreateFormData,
  IPaymentTemplateUpdateFormData,
} from "./schema";
import { api } from "@/client-actions/helper";

export async function updatePaymentTemplate(
  data: IPaymentTemplateUpdateFormData,
  paymentTemplateId: number | undefined | null
) {
  if (!paymentTemplateId) return undefined;
  toast.loading("Updating payment template's data...", {
    id: "u-paymentTemplate",
  });
  try {
    const res = await api("/payment/templates/" + paymentTemplateId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("Payment template updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-paymentTemplate");
  }
}

export async function createPaymentTemplate(
  data: IPaymentTemplateCreateFormData
) {
  toast.loading("Creating payment template", { id: "c-paymentTemplate" });
  try {
    const res = await api("/payment/templates", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("Payment Template created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-paymentTemplate");
  }
}

/**
 * Number to words
 *
 */

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

export function numberToWords(num: number): string {
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
  if (num === 0) return "Zero";

  let word = "";

  // Process each group of 3 digits, starting from the right (e.g. billion, million, thousand, etc.)
  for (let i = 0, unit = num; unit > 0; i++, unit = Math.floor(unit / 1000)) {
    const group = unit % 1000;
    if (group > 0) {
      word = `${convertThreeDigits(group)} ${scales[i]} ${word}`.trim();
    }
  }

  return word.trim();
}

function convertThreeDigits(num: number): string {
  let result = "";

  if (num >= 100) {
    result += `${ones[Math.floor(num / 100)]} Hundred `;
    num %= 100;
  }

  if (num >= 20) {
    result += `${tens[Math.floor(num / 10)]} `;
    num %= 10;
  }

  if (num > 0) {
    result += `${ones[num]} `;
  }

  return result.trim();
}
