"use client";
import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";
import { Curriculum } from "@prisma/client";

export const useGetAllCurriculums = (
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["curriculums"],
    queryFn: async () => {
      const res = await api("/curriculum/", {
        method: "get",
      });
      if (res?.success) {
        return res.data as Curriculum[];
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};

export const useGetCurriculumById = (
  curriculumId: number,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["curriculums", curriculumId],
    queryFn: async () => {
      const res = await api("/curriculum/" + curriculumId, {
        method: "get",
      });
      if (res?.success) {
        return res.data as Curriculum;
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};
