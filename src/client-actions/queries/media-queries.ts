import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";
import { Media } from "@prisma/client";

export const useGetMediaByGroup = (
  groupName: string,
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["media", groupName],
    queryFn: async () => {
      const res = await api("/media/group/" + groupName, {
        method: "get",
      });
      if (res?.success) {
        return res.data as Media[];
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};
