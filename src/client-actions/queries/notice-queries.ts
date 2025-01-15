import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";
import { NoticeListDTO } from "@/app/api/services/types/dto.types";

export type PublicNoticeListViewModel = NoticeListDTO;
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
