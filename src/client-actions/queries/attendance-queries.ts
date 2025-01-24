import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export type AttendanceListViewModel = {
  id: number;
  full_name: string;
  roll: number;
  attendance_record: {
    date: string;
    status: string;
  }[];
}[];
export const useGetAttendanceList = (
  filter: {
    page?: number;
    pageSize?: number;
    cohortId?: number;
    date?: Date;
  },
  queryOptions?: CustomQueryOptions
) => {
  const [key, setKey] = useState<Array<string>>([]);
  let route = "/attendance?";

  if (filter?.page) route += `page=${filter.page}`;
  if (filter?.pageSize) route += `&pageSize=${filter.pageSize}`;
  if (filter.cohortId) route += `&cohortId=${filter.cohortId}`;
  if (filter.date) route += `&date=${format(filter.date, "yyyy-MM-dd")}`;

  useEffect(() => {
    setKey(["attendance", route]);
  }, [route]);
  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) {
        const data = res.data as AttendanceListViewModel;
        return data;
      }
    },

    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: filter.cohortId !== undefined && filter.date !== undefined,

    refetchOnWindowFocus: false,

    ...queryOptions,
  });

  return { key, ...query };
};
