"use client";

import { useGetStudentGroup } from "@/client-actions/queries/student-queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import { isEmpty } from "lodash";
import { LoaderCircle, Pencil } from "lucide-react";
import Link from "next/link";

type Props = {};

function StudentGroup({}: Props) {
  const { data: grades, isLoading } = useGetStudentGroup();

  function renderEditButton(url: string) {
    return (
      <Link href={url}>
        <Pencil className="w-2 h-2" />
      </Link>
    );
  }
  return (
    <div className="max-w-[768px] mx-auto">
      <h1 className="text-2xl mb-4">Student Groups</h1>

      <h3 className="text-lg flex gap-2 items-center mt-2">
        Grade List
        {isLoading && <LoaderCircle className="w-3 h-3 animate-spin" />}
      </h3>
      {isLoading && <div>Fetching data....</div>}
      <Accordion type="multiple">
        <div>
          {grades?.map((grade) => (
            <AccordionItem
              key={grade.id}
              value={grade.name}
              className="border-b-0"
            >
              <AccordionTrigger className="border-b-0 flex ">
                <div className="flex gap-2 items-center">
                  {grade.name}{" "}
                  {renderEditButton("/management/groups/grades/" + grade.id)}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 border-l">
                {!grade.sections && <div>No section found</div>}
                {grade.sections?.map((section) => (
                  <Accordion key={section.id} type="single" collapsible>
                    <AccordionItem value={section.name} className="border-b-0">
                      <AccordionTrigger>
                        <div className="flex gap-2 items-center">
                          {section.name}{" "}
                          {renderEditButton(
                            "/management/groups/sections/" + section.id
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 border-l">
                        {isEmpty(section.cohorts) && (
                          <div className="text-slate-500">No cohort found!</div>
                        )}
                        {!isEmpty(section.cohorts) && (
                          <div className="flex flex-col gap-2">
                            {section.cohorts?.map((cohort) => (
                              <div
                                key={cohort.id}
                                className="flex gap-2 items-center"
                              >
                                {cohort.name}
                                {renderEditButton(
                                  "/management/groups/cohorts/" + cohort.id
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </Accordion>
    </div>
  );
}

export default StudentGroup;
