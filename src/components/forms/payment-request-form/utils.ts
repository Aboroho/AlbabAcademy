import toast from "react-hot-toast";
import {
  IPaymentRequestCreateFormData,
  IPaymentRequestUpdateFormData,
} from "./schema";
import { api } from "@/client-actions/helper";

export async function updatePaymentRequest(
  data: IPaymentRequestUpdateFormData,
  paymentRequestId: number | undefined | null
) {
  if (!paymentRequestId) return undefined;
  toast.loading("Updating payment request data...", {
    id: "u-paymentRequest",
  });
  try {
    const res = await api("/payment/payment-request/" + paymentRequestId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("Payment request updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-paymentRequest");
  }
}

export async function createPaymentRequest(
  data: IPaymentRequestCreateFormData
) {
  toast.loading("Creating payment request", { id: "c-paymentRequest" });
  try {
    const res = await api("/payment/payment-request", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("Payment request created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-paymentRequest");
  }
}
