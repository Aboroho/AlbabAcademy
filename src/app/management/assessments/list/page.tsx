"use client";

import { useGetAssessments } from "@/client-actions/queries/assessment-queries";
import { Button } from "@/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
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
import Link from "next/link";

function AssessmentList() {
  const { data: assessments } = useGetAssessments();

  return (
    <div>
      <div className="assessment-list flex flex-col gap-4">
        {assessments?.map((assessment) => {
          return (
            <div key={assessment.id} className="border rounded-md ">
              <Accordion type="single" collapsible>
                <AccordionItem value={assessment.id.toString()}>
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
                                Total Marks
                              </TableHead>
                              <TableHead className="text-center">
                                Assigned Teacher
                              </TableHead>
                              <TableHead className="text-center">
                                Status
                              </TableHead>
                              <TableHead className="text-right">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          {assessment.assessment_subjects.map((subject) => (
                            <TableRow key={subject.id}>
                              <TableCell>{subject.subject_name}</TableCell>
                              <TableCell className="text-center">
                                {subject.total_marks}
                              </TableCell>
                              <TableCell className="text-center">
                                {subject.teacher?.full_name || "--"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge>{subject.status}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <Link
                                    target="_blank"
                                    href={`/management/assessments/${assessment.id}/${subject.id}`}
                                  >
                                    <Button
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                      size="sm"
                                      variant="default"
                                    >
                                      Assess
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {assessment.description}
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

export default AssessmentList;
