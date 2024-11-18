import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api, DEFAULT_QUERY_FILTER } from "../helper";
import {
  IPaymentRequestResponse,
  IPaymentTemplateResponse,
} from "@/types/response_types";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

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

export type StudentPaymentResponse = {
  id: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  for_month: string;
  for_year: string;
  payment_request_title: string;
  student: {
    phone: string;
    full_name: string;
    student_id: string;
    user_id: number;
    cohort_id: number;
    cohort_name: string;
    section_name: string;
    section_id: number;
    grade_name: string;
    grade_id: number;
  };
  payment_fields: {
    id: number;
    description: string;
    amount: number;
    payment_template_id: number;
  }[];
};

export type PaymentQueryFilter = {
  page: number;
};

export const useGetStudentPayments = (
  queryOptions?: CustomQueryOptions,
  filter?: PaymentQueryFilter
) => {
  const page = filter?.page;
  let route = "/students/payments?";

  if (page) route += `page=${page}&`;

  const query = useQuery({
    queryKey: ["student-payments"],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        return res.data as StudentPaymentResponse[];
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};
