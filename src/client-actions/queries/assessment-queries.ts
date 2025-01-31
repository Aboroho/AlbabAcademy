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
  created_at: Date | string;
  status: AssessmentStatus;
  assessment_subjects: {
    id: number;
    assessment_id: number;
    subject_name: string;
    total_marks: number;
    teacher_id: number | null;
    status: AssessmentStatus;
    teacher?: {
      full_name: string;
      id: number;
    };
  }[];
}[];

export const useGetAssessments = (
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["assessments", "all"],
    queryFn: async () => {
      const res = await api("/assessments", {
        method: "get",
      });
      if (res?.success) {
        return res.data as IAssessmentsResponse;
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};

type StudentForAssessment = {
  title: string;
  assessment_type: string;
  grade: {
    name: string;
  };
  assessment_subjects: {
    subject_name: string;
    total_marks: number;
  }[];
  assessment_results: {
    mark: number;
    student: {
      full_name: string;
      id: number;
      roll: number;
      cohort: {
        name: string;
      };
    };
  }[];
};
export const useGetStudentForAssessment = (
  assessmentId: number,
  subjectId: number,
  queryOptions?: CustomQueryOptions
  // filter?: {}
) => {
  const query = useQuery({
    queryKey: ["assessments", assessmentId, subjectId],
    queryFn: async () => {
      const res = await api(`/assessments/${assessmentId}/${subjectId}`, {
        method: "get",
      });
      if (res?.success) {
        return res.data as StudentForAssessment;
      }
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    ...queryOptions,
  });
  return query;
};
