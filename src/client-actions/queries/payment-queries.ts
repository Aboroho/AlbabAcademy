import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api, DEFAULT_QUERY_FILTER } from "../helper";
import {
  IPaymentRequestResponse,
  IPaymentTemplateResponse,
} from "@/types/response_types";

export const useGetPaymentTemplates = (
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["payment-templates", "all"],
    queryFn: async () => {
      const res = await api("/payment/templates", {
        method: "get",
      });
      if (res?.success) {
        return res.data as IPaymentTemplateResponse[];
      }
    },
    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

export const useGetPaymentTemplateById = (
  id: number,
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["payment-template", id.toString()],
    queryFn: async () => {
      const res = await api("/payment/templates/" + id, {
        method: "get",
      });
      if (res?.success) {
        return res.data as IPaymentTemplateResponse;
      }
    },
    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

export const useGetPaymentRequest = (
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["payment-requests", "all"],
    queryFn: async () => {
      const res = await api("/payment/payment-request", {
        method: "get",
      });
      if (res?.success) {
        return res.data as IPaymentRequestResponse[];
      }
    },
    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

export const useGetPaymentRequestById = (
  id: number,
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["payment-request", id.toString()],
    queryFn: async () => {
      const res = await api("/payment/payment-request/" + id, {
        method: "get",
      });
      if (res?.success) {
        return res.data as IPaymentRequestResponse;
      }
    },
    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};
