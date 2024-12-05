"use client";

import { useQuery } from "@tanstack/react-query";

import { CustomQueryOptions } from "@/types/common";
import { api, DEFAULT_QUERY_FILTER } from "../helper";

import {
  ICohortResponseWithParent,
  IGradeResponse,
  ISectionResponse,
  ISectionResponseWithParent,
} from "@/types/response_types";
import { generateQueryParamsFromObject } from "@/lib/utils";
import {
  StudentListDTO,
  StudentProfileDTO,
} from "@/app/api/services/types/dto.types";

export type IGetStudentsQueryFilter = {
  grade_id?: number;
  section_id?: number;
  cohort_id?: number;
  name?: string;
  grade_name?: string;
  section_name?: string;
  cohort_name?: string;
};

export type StudentListViewModel = StudentListDTO;
export const useGetStudents = (
  queryOptions?: CustomQueryOptions,
  filter?: IGetStudentsQueryFilter
) => {
  const queryParams = generateQueryParamsFromObject(filter || {});

  const route = "/students?" + queryParams;
  const query = useQuery({
    queryKey: ["students", route],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) return res.data as StudentListViewModel;
    },
    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

export type StudentProfileViewModel = StudentProfileDTO;
export const useGetStudentById = (
  id: number | null | undefined,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      if (!id) return {} as StudentProfileViewModel;
      const res = await api("/students/" + id, {
        method: "get",
      });
      if (res?.success) return res.data as StudentProfileViewModel;
    },

    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

// grade query
export const useGetGradeList = (queryOptions?: CustomQueryOptions) => {
  const query = useQuery({
    queryKey: ["grades", "all"],
    queryFn: async () => {
      const res = await api("/grades", {
        method: "get",
      });
      if (res?.success) return res.data as IGradeResponse[];
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    ...queryOptions,
  });
  return query;
};

export const useGetGradeById = (
  id: number | null | undefined,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["byId", "grade", id],
    queryFn: async () => {
      if (!id) return {} as IGradeResponse;
      const res = await api("/grades/" + id, {
        method: "get",
      });
      if (res?.success) return res.data as IGradeResponse;
    },

    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

// section query
export const useGetSectionList = (
  queryOptions?: CustomQueryOptions,
  filter?: {
    gradeId?: number;
  }
) => {
  const { gradeId } = filter || {};
  let route = "/sections?";
  if (gradeId) route += `grade_id=${gradeId}`;
  const query = useQuery({
    queryKey: [route],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });

      if (res?.success) return res.data as ISectionResponseWithParent[];
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    ...queryOptions,
  });
  return query;
};

export const useGetSectionById = (
  id: number | null | undefined,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["byId", "section", id],
    queryFn: async () => {
      if (!id) return {} as ISectionResponse;
      const res = await api("/sections/" + id, {
        method: "get",
      });
      if (res?.success) return res.data as ISectionResponse;
    },

    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

// Cohort query
export const useGetCohortList = (
  queryOptions?: CustomQueryOptions,
  filter?: {
    sectionId: number;
    limit?: number;
  }
) => {
  const { sectionId } = filter || {};
  let route = "/cohorts?";

  if (sectionId) route += `section_id=${sectionId}`;
  const hasFilters = Object.entries(filter || {}).length > 0;
  const query = useQuery({
    queryKey: hasFilters ? ["cohort", route] : ["cohort", "all"],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) return res.data as ICohortResponseWithParent[];
    },

    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    ...queryOptions,
  });
  return query;
};

export const useGetCohortById = (
  id: number | null | undefined,
  queryOptions?: CustomQueryOptions
) => {
  const query = useQuery({
    queryKey: ["byId", "cohort", id],
    queryFn: async () => {
      if (!id) return {} as ICohortResponseWithParent;
      const res = await api("/cohorts/" + id, {
        method: "get",
      });
      if (res?.success) return res.data as ICohortResponseWithParent;
    },

    ...DEFAULT_QUERY_FILTER,
    ...queryOptions,
  });
  return query;
};

export type StudentGroupViewModel = {
  id: number;
  name: string;
  sections?: {
    id: number;
    name: string;
    cohorts?: {
      id: number;
      name: string;
    }[];
  }[];
};

export const useGetStudentGroup = (queryOptions?: CustomQueryOptions) => {
  const route = "/groups";

  const query = useQuery({
    queryKey: ["student-groups", "all"],
    queryFn: async () => {
      const res = await api(route, {
        method: "get",
      });
      if (res?.success) return res.data as StudentGroupViewModel[];
    },

    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    ...queryOptions,
  });
  return query;
};
