import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";
import { Expense } from "@prisma/client";

export const useGetAllExpenses = (
  queryOptions?: CustomQueryOptions,
  filter?: {
    startDate?: Date | string | number;
    endDate?: Date | string | number;
    page?: number;
    pageSize?: number;
  }
) => {
  let route = "/expense?";

  if (filter?.startDate) route += `start=${filter.startDate}`;
  if (filter?.endDate) route += `&end=${filter.endDate}`;
  if (filter?.page) route += `&page=${filter.page}`;
  if (filter?.pageSize) route += `&pageSize=${filter.pageSize}`;
  const query = useQuery({
    queryKey: ["expense", route],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        const data = res.data as {
          payments: Array<Expense>;
          count: number;
        };
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
