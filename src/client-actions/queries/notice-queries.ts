import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api, DEFAULT_QUERY_FILTER } from "../helper";
import { NoticeListDTO } from "@/app/api/services/types/dto.types";
import { Notice } from "@prisma/client";

export type PublicNoticeListViewModel = NoticeListDTO;
export type PrivateNoticeListViewModel = NoticeListDTO;

export const useGetPublicNotices = (
  queryOptions?: CustomQueryOptions,
  filter?: {
    page?: number;
    pageSize?: number;
    notice_category: string;
  }
) => {
  let route = "/notice/public_notice?";

  if (filter?.page) route += `page=${filter.page}`;
  if (filter?.pageSize) route += `&pageSize=${filter.pageSize}`;
  if (filter?.notice_category)
    route += `&notice_category=${filter.notice_category}`;
  const query = useQuery({
    queryKey: ["notices", route],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        const data = res.data as PublicNoticeListViewModel;
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

export const useGetPrivateNotices = (
  queryOptions?: CustomQueryOptions,
  filter?: {
    page?: number;
    pageSize?: number;
    notice_category?: [string];
  }
) => {
  let route = "/notice?";

  if (filter?.page) route += `page=${filter.page}`;
  if (filter?.pageSize) route += `&pageSize=${filter.pageSize}`;
  if (filter?.notice_category)
    route += `&notice_category=${filter.notice_category}`;
  const query = useQuery({
    queryKey: ["notices", "private"],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        const data = res.data as PrivateNoticeListViewModel;
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

export const useGetNoticeById = (
  id: number | null | undefined,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["notice", id],
    queryFn: async () => {
      if (!id) return {} as Notice;
      const res = await api("/notice/" + id, {
        method: "get",
      });
      if (res?.success) return res.data as Notice;
    },

    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};
