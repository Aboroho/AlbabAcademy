import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api, DEFAULT_QUERY_FILTER } from "../helper";
import { NoticeListDTO } from "@/app/api/services/types/dto.types";
import { Notice, NoticeCategory, NoticeTarget } from "@prisma/client";
import { useEffect, useState } from "react";

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
    notice_category?: NoticeCategory[];
    notice_target?: NoticeTarget[];
  }
) => {
  let route = "/notice?";

  if (filter?.page) route += `page=${filter.page}`;
  if (filter?.pageSize) route += `&pageSize=${filter.pageSize}`;
  if (filter?.notice_category)
    route += `&notice_category=${filter.notice_category.join(",")}`;
  if (filter?.notice_target)
    route += `&notice_target=${filter.notice_target.join(",")}`;

  const [key, setKey] = useState(["notices", "private", route]);

  useEffect(() => {
    setKey(["notices", "private", route]);
  }, [route]);
  const query = useQuery({
    queryKey: key,
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

  return { ...query, key };
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
