import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";
import { StaticPage } from "@prisma/client";
import { CustomQueryOptions } from "@/types/common";

export const useGetStaticPageBySlug = (
  slug: string,
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      const res = await api("/static-page/" + slug, {
        method: "get",
      });
      if (res?.success) {
        return res.data as StaticPage;
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};
