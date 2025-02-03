"use client";
import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";
import { Testimonial } from "@prisma/client";

export const useGetAllTestimonial = (
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await api("/testimonial/", {
        method: "get",
      });
      if (res?.success) {
        return res.data as Testimonial[];
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};

export const useGetTestimonialById = (
  testimonialId: number,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["testimonial", testimonialId],
    queryFn: async () => {
      const res = await api("/testimonial/" + testimonialId, {
        method: "get",
      });
      if (res?.success) {
        return res.data as Testimonial;
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};
