import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api, DEFAULT_QUERY_FILTER } from "../helper";
import {
  IPaymentRequestResponse,
  IPaymentTemplateResponse,
} from "@/types/response_types";

import {
  PaymentDetailsDTO,
  PaymentDTO,
  PaymentRequestEntryListDTO,
  StudentPaymentListDTO,
} from "@/app/api/services/types/dto.types";
import { useEffect, useState } from "react";
import { Payment } from "@prisma/client";

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

export type PaymentRequestEntryListViewModel = PaymentRequestEntryListDTO;

export const useGetPaymentRequestEntry = (
  queryOptions?: CustomQueryOptions,
  filter?: {
    target: "teacher" | "student";
    page?: number;
    pageSize?: number;
  }
) => {
  const target = filter?.target || "student";
  const page = filter?.page || 1;
  const pageSize = Math.min(filter?.pageSize || 50, 100);

  const route = `/payment/payment-request?target=${target}&page=${page}&pageSize=${pageSize}`;
  const query = useQuery({
    queryKey: ["payment-requests-entry", target, page, pageSize],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        return res.data as PaymentRequestEntryListViewModel;
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

export type StudentPaymentListViewModel = StudentPaymentListDTO;
export type PaymentViewModel = PaymentDTO;
export type PaymentDetailsViewModel = PaymentDetailsDTO;

export type PaymentQueryFilter = {
  page: number;
  pageSize: number;
  grade_id?: number;
};

export const useGetStudentPaymentList = (
  queryOptions?: CustomQueryOptions,
  filter?: PaymentQueryFilter
) => {
  const [queryKey, setQueryKey] = useState("");
  const page = filter?.page;
  const pageSize = filter?.pageSize;
  const gradeId = filter?.grade_id;
  let route = "/students/payments?";

  if (page) route += `page=${page}`;
  if (pageSize) route += `&page_size=${pageSize}`;
  if (gradeId) route += `&grade_id=${gradeId}`;

  useEffect(() => setQueryKey(route), [route]);
  const query = useQuery({
    queryKey: ["student-payment", route],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        const data = res.data as StudentPaymentListDTO;
        return data as StudentPaymentListViewModel;
      }
    },

    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    ...queryOptions,
  });
  return { ...query, queryKey: ["student-payment", queryKey] };
};

export const useGetPayments = (
  queryOptions?: CustomQueryOptions,
  filter?: {
    startDate?: Date | string | number;
    endDate?: Date | string | number;
  }
) => {
  let route = "/payment?";

  if (filter?.startDate) route += `start=${filter.startDate}`;
  if (filter?.endDate) route += `&end=${filter.endDate}`;

  const query = useQuery({
    queryKey: ["payments", route],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        const data = res.data as Payment[];
        return data;
      }
    },

    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    ...queryOptions,
  });

  return query;
};
