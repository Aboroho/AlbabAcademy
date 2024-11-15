import { CustomQueryOptions } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { api } from "../helper";

import { AssessmentStatus } from "prisma/prisma-client";
export type IAssessmentsResponse = {
  description: string | null;
  id: number;
  title: string;
  date: Date;
  grade_id: number;
  assessment_type: string | null;
  result_date: Date | null;
  assessment_status: AssessmentStatus;
  assessment_subjects: {
    id: number;
    assessment_id: number;
    subject_name: string;
    total_mark: number;
    teacher_id: number | null;
  }[];
}[];
export const useGetAssessments = (
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["payment-template", "all"],
    queryFn: async () => {
      const res = await api("/assessments", {
        method: "get",
      });
      if (res?.success) {
        return res.data;
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};
