"use client";
import { useGetAssessmentWithResult } from "@/client-actions/queries/assessment-queries";
import { useGetStudentByUserId } from "@/client-actions/queries/student-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import { Badge } from "@/components/shadcn/ui/badge";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import { formatDate } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

type Props = {};

function StudentView({}: Props) {
  const session = useSession();

  const { data: studentInfo } = useGetStudentByUserId(
    Number(session.data?.user.id)
  );
  const studentId = Number(studentInfo?.id);
  const { data: asessmentsData, isLoading } = useGetAssessmentWithResult(
    studentId,
    {
      enabled: !!studentId,
    }
  );

  // const totalAssessments = asessmentsData?.count;
  const assessments = asessmentsData?.assessments;

  if (isLoading) return <div>Loading</div>;
  console.log(assessments);
  return (
    <div>
      <div className="assessment-list flex flex-col gap-4">
        {assessments?.map((assessment) => {
          return (
            <div key={assessment.title} className="border rounded-md ">
              <Accordion type="single" collapsible>
                <AccordionItem value={assessment.title.toString()}>
                  <AccordionTrigger asChild>
                    <div className="flex w-full justify-between  p-2 px-4 cursor-pointer text-md bg-gray-100">
                      <h2 className="flex gap-2 items-center font-semibold">
                        {assessment.title}
                        <Badge>{assessment.assessment_type}</Badge>
                      </h2>
                      <div className="flex gap-4 items-center">
                        <div className="text-[12px] text-gray-700">
                          {formatDate(assessment.created_at)}
                        </div>
                        <ChevronDown className="ml-auto w-4" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-white ">
                      <div className="">
                        <Table>
                          <TableHeader>
                            <TableRow className="text-slate-900">
                              <TableHead className="">Subject Name</TableHead>
                              <TableHead className="text-center">
                                Mark
                              </TableHead>

                              <TableHead className="text-right">
                                Teacher
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          {assessment.assessment_results.map((result) => (
                            <TableRow
                              key={result.assessment_subject.subject_name}
                            >
                              <TableCell className="text-left">
                                {result.assessment_subject.subject_name}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="text-orange-500 font-medium">
                                  {result.mark}
                                </span>
                                /{result.assessment_subject.total_marks}
                              </TableCell>
                              <TableCell className="text-right">
                                {result.assessment_subject.teacher.full_name}
                              </TableCell>
                            </TableRow>
                          ))}
                        </Table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentView;
