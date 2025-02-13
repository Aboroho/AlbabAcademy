"use client";

import { DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";

import { ActivitySquare, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

import Link from "next/link";

import { useGetStudents } from "@/client-actions/queries/student-queries";

import { Badge } from "@/components/shadcn/ui/badge";

import toast from "react-hot-toast";

import { FormProvider, useForm } from "react-hook-form";
import { SelectGradeField } from "@/components/forms/common-fields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/client-actions/helper";
import { StudentListDTO } from "@/app/api/services/types/dto.types";
import { StudentStatus } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import { cn } from "@/lib/utils";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { Protected } from "@/components/auth";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";

function StudentListTable() {
  const form = useForm<{ grade_id: number; section_id: number }>({});
  const gradeId = form.watch("grade_id");
  const sectionId = form.watch("section_id");
  const page = 1;
  const filter = { grade_id: gradeId, section_id: sectionId, page };
  const { data, isLoading, key } = useGetStudents(
    {
      enabled: true,
    },
    filter
  );

  const students = data?.students;
  const count = data?.count;
  const pageSize = 20;

  console.log("render");

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api("/students/" + id, {
        method: "DELETE",
      });
    },

    onSettled: (res) => {
      if (!res?.success) return;
      const data = res.data as { id: number };

      queryClient.invalidateQueries({ queryKey: ["students", "all"] });
      queryClient.setQueryData(key, (oldData: StudentListDTO) => {
        if (oldData && oldData.students) {
          console.log(oldData.students);
          oldData.students = oldData.students.filter(
            (student) => student.id !== data.id
          );
          return oldData;
        }
        return oldData;
      });
    },
  });

  async function handleStatus(id: number, status: string) {
    toast.loading("Updating Student...", { id: "update-student" });
    try {
      const res = await api("/students/" + id + "/update-status", {
        method: "PATCH",
        body: JSON.stringify({
          status: status,
        }),
      });
      if (res.success) {
        toast.success("Student updated");
        queryClient.invalidateQueries({ queryKey: ["students", "all"] });
        queryClient.setQueryData(key, (oldData: StudentListDTO) => {
          if (oldData && oldData.students) {
            oldData.students = oldData.students.map((student) => {
              if (student.id === id) {
                return {
                  ...student,
                  student_status: status as StudentStatus,
                };
              }
              return student;
            });

            return oldData;
          }

          return oldData;
        });
      } else {
        toast.error("Failed to update Student");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Some error occured");
      console.log(err);
    } finally {
      toast.dismiss("update-student");
    }
  }

  async function handleDelete(id: number) {
    toast.loading("Deleting Student...", { id: "delete-student" });
    try {
      const res = await deleteMutation.mutateAsync(id);
      if (res.success) {
        toast.success("Student deleted");
      } else {
        toast.error("Failed to delete Student");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Some error occured");
      console.log(err);
    } finally {
      toast.dismiss("delete-student");
    }
  }

  return (
    <div className="p-2 lg:p-4">
      <FormProvider {...form}>
        <div className="my-4 flex max-w-[268px]">
          <SelectGradeField disabled={isLoading} />
        </div>
      </FormProvider>

      {/*!isLoading && <DataTable data={studentTableRows} columns={columns} />} */}

      <div className="max-w-[1536px] overflow-x-auto ">
        <div className="w-[1536px] h-[70vh] overflow-hidden">
          <div className="grid grid-cols-9 text-center font-semibold pb-2 border-b px-6">
            <div className="text-left">Avatar</div>
            <div className="text-left">Name</div>
            <div className="text-left">Grade</div>
            <div className="">Section</div>
            <div className="">Cohort</div>
            <div className="text-center">Roll</div>
            <div className="">Student ID</div>
            <div className="">Status</div>
            <div className="text-right pr-2">Action</div>
          </div>

          {/* {isLoading && renderSkeleton()} */}
          {isLoading && <TableSkeleton />}
          {students?.length === 0 && (
            <div className="flex justify-center mt-10 h-full">
              <p className="text-gray-500">No Students Found</p>
            </div>
          )}
          <div className="overflow-y-scroll h-full">
            <Accordion type="multiple" className="h-auto overflow-y-scroll">
              {students?.map((student) => {
                const studentStatus = student.student_status;
                const studentStatusClass =
                  studentStatus === "INACTIVE"
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : "";
                return (
                  <AccordionItem
                    value={student.id.toString()}
                    key={student.id}
                    className={cn(
                      "my-6  rounded-md bg-gray-100  border-2 border-slate-300"

                      // lastModifiedPaymentRequestId === student.id &&
                      //   "bg-slate-200 border-2 border-yellow-500"
                    )}
                  >
                    <AccordionTrigger asChild>
                      <div
                        key={student.id}
                        className={cn(
                          "grid grid-cols-9 py-4  px-2 hover:bg-slate-200 cursor-pointer rounded-md text-center border-b border-gray-300",
                          studentStatusClass
                        )}
                      >
                        <div>
                          <Image
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] rounded-full border"
                            src={
                              student.user.avatar ||
                              "/assets/images/student-avatar.png"
                            }
                            alt={student.full_name}
                          />
                        </div>
                        <div className="text-left">{student?.full_name}</div>
                        <div className="flex text-center">
                          <Badge>{student?.grade.name}</Badge>
                        </div>
                        <div className="text-center">
                          <Badge>{student.section.name}</Badge>
                        </div>
                        <div className="">
                          {" "}
                          <Badge>{student.cohort.name}</Badge>
                        </div>
                        <div className="font-bold">{student.roll}</div>
                        <div className="font-bold">{student.student_id}</div>
                        <div className="font-bold">
                          <Badge
                            className={
                              student.student_status === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }
                          >
                            {student.student_status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          {
                            <Popover>
                              <PopoverTrigger
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DotsVerticalIcon className="w-6 h-6 cursor-pointer" />
                              </PopoverTrigger>
                              <PopoverContent className=" z-[1] w-[150px]">
                                <div className="action-menu-container">
                                  <Link
                                    href={"/management/students/" + student.id}
                                    className="flex gap-3  items-center  cursor-pointer hover:text-slate-700"
                                  >
                                    <Pencil1Icon className="w-5 h-5" />
                                    <span>Edit</span>
                                  </Link>
                                  <Protected action="hide" roles={["ADMIN"]}>
                                    <AlertDialog
                                      onConfirm={() =>
                                        handleStatus(
                                          student.id,
                                          student.student_status === "ACTIVE"
                                            ? "INACTIVE"
                                            : "ACTIVE"
                                        )
                                      }
                                      confirmText={
                                        student.student_status === "ACTIVE"
                                          ? "Deactivate"
                                          : "Activate"
                                      }
                                      message="Confirm action"
                                    >
                                      <div className="flex gap-3  cursor-pointer text-blue-500 hover:text-blue-600">
                                        <ActivitySquare className="w-5 h-5" />
                                        <span>
                                          {student.student_status === "ACTIVE"
                                            ? "Deactivate"
                                            : "Activate"}
                                        </span>
                                      </div>
                                    </AlertDialog>

                                    <AlertDialog
                                      onConfirm={() => handleDelete(student.id)}
                                      confirmText="Delete"
                                      message=""
                                    >
                                      <div className="flex gap-3  cursor-pointer text-red-500 hover:text-red-600">
                                        <Trash2 className="w-5 h-5" />
                                        <span>Delete</span>
                                      </div>
                                    </AlertDialog>
                                  </Protected>
                                </div>
                              </PopoverContent>
                            </Popover>
                          }
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className=" ">
                      <div className="flex"></div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <PaginationWithLinks
          page={1}
          pageSize={pageSize}
          totalCount={count || 0}
        />
      </div>
    </div>
  );
}

export default StudentListTable;
