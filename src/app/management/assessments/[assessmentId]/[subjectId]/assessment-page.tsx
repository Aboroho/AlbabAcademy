"use client";

import { api } from "@/client-actions/helper";
import { useGetStudentForAssessment } from "@/client-actions/queries/assessment-queries";
import { Button } from "@/components/button";

import { Badge } from "@/components/shadcn/ui/badge";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import InputField from "@/components/ui/input-field";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Controller, FieldError, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Props = {
  assessmentId: number;
  subjectId: number;
};

const schema = z.object({
  results: z.array(
    z.object({
      student_id: z.number(),
      mark: z.number(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

function AssessmentPage({ assessmentId, subjectId }: Props) {
  const { data: assessment, isLoading } = useGetStudentForAssessment(
    assessmentId,
    subjectId
  );

  const results = assessment?.assessment_results;
  const subject = assessment?.assessment_subjects?.[0].subject_name;
  const totalMarks = assessment?.assessment_subjects?.[0].total_marks;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { results: [] },
    mode: "onChange",
  });

  const errors = form.formState.errors;

  useEffect(() => {
    if (!assessment?.assessment_results) return;
    const fetchedResults = assessment.assessment_results.map((result) => ({
      student_id: result.student.id,
      mark: result.mark,
    }));
    form.setValue("results", fetchedResults);
  }, [form, assessment, assessmentId, subjectId]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api(`/assessments/${assessmentId}/${subjectId}`, {
        body: JSON.stringify(data),
        method: "PUT",
      });
    },
  });

  async function onSubmit(data: FormData) {
    let flag = false;
    data.results.forEach((result, idx) => {
      if (totalMarks && result.mark > totalMarks) {
        flag = true;
        form.setError(`results.${idx}.mark`, { message: "Invalid mark" });
      }
    });
    if (flag) return;

    try {
      toast.loading("Updating Result", { id: "update-result" });
      const res = await updateMutation.mutateAsync(data);
      if (res.success) toast.success("Result updated successfully");
      else toast.error("something went wrong");
    } catch (err) {
      console.log(err);
      toast.error("something went wrong");
    } finally {
      toast.dismiss("update-result");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        {!assessment && (
          <div className="flex flex-col gap-2 mb-4">
            <Skeleton className="w-1/2 h-[35px]" />
            <Skeleton className="w-[150px] h-[25px]" />
            <Skeleton className="w-[150px] h-[25px]" />
          </div>
        )}
        {assessment && (
          <div className="flex flex-col gap-2 mb-6 p-2">
            <div className="text-lg">
              <span className="text-orange-600">{assessment?.title}</span>
            </div>
            <div>
              GRADE: <Badge>{assessment?.grade?.name}</Badge>
            </div>
            <div>
              SUBJECT: <Badge className="bg-orange-600">{subject}</Badge>
            </div>
          </div>
        )}
        <div className="bg-white p-2 pb-10 rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="text-slate-900">
                <TableHead className="">Student Name</TableHead>
                <TableHead className="text-center">Cohort </TableHead>
                <TableHead className="text-center">Roll</TableHead>
                <TableHead className="text-right">Obtained Mark</TableHead>
              </TableRow>
            </TableHeader>

            {isLoading && (
              <>
                <TableRow>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-[30px]" />
                  </TableCell>
                </TableRow>
              </>
            )}

            {results?.map((result, idx) => (
              <TableRow key={result.student.id}>
                <TableCell className="max-w-[100px] lg:max-w-[200px]">
                  {result.student.full_name}
                </TableCell>
                <TableCell className="text-center">
                  {result.student.cohort.name}
                </TableCell>
                <TableCell className="text-center">
                  {result.student.roll}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-block w-[100px]">
                    <Controller
                      control={form.control}
                      name={`results.${idx}.mark`}
                      render={({ field }) => (
                        <InputField
                          onChange={(e) => {
                            const mark = parseInt(e.target.value || "0");
                            field.onChange(mark);
                          }}
                          error={errors.results?.[idx]?.mark as FieldError}
                          value={form.watch(`results.${idx}.mark`)}
                          rightIcon={<div> /{totalMarks}</div>}
                        />
                      )}
                    />
                    {/* <InputField
                      placeholder="e.g. 92"
                      {...form.register(`results.${idx}.mark`, {
                        valueAsNumber: true,
                      })}
                      error={errors.results?.[idx]?.mark}
                    /> */}
                  </div>{" "}
                </TableCell>
              </TableRow>
            ))}
          </Table>
          {!isLoading && results?.length === 0 && (
            <div className=" text-center mt-6  text-gray-500">
              No students found
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit Result</Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          Publish Result
        </Button>
      </div>
    </form>
  );
}

export default AssessmentPage;
