import { useQuery } from "@tanstack/react-query";

import { CustomQueryOptions } from "@/types/common";
import { api, DEFAULT_QUERY_FILTER } from "../helper";
import { ITeacherResponse } from "@/types/response_types";

export const useGetTeachers = (
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["teacher", "all"],
    queryFn: async () => {
      const res = await api("/teachers", {
        method: "get",
      });
      if (res?.success) {
        return res.data as ITeacherResponse[];
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};

export const useGetTeacherById = (
  id: number | null | undefined,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["byId", "teacher", id],
    queryFn: async () => {
      if (!id) return {} as ITeacherResponse;
      const res = await api("/teachers/" + id, {
        method: "get",
      });
      if (res?.success) return res.data as ITeacherResponse;
    },

    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};
