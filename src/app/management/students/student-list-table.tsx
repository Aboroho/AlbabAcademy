"use client";

import DataTable from "@/components/data-table";

import { Button } from "@/components/ui/button";
import {
  CaretSortIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { useGetStudents } from "@/client-actions/queries/student-queries";

import { IStudentResponse } from "@/types/response_types";
import { isEmpty } from "@/components/forms/form-utils";
import { Popover } from "@/components/shadcn/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Badge } from "@/components/shadcn/ui/badge";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { Protected } from "@/components/auth";
import { FormProvider, useForm } from "react-hook-form";
import { SelectGradeField } from "@/components/forms/common-fields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/client-actions/helper";
import { StudentListDTO } from "@/app/api/services/types/dto.types";

export type IStudentTableRow = {
  id: number;
  avatar: string;
  name: string;
  studentId: string;
  grade: string;
  section: string;
  cohort: string;
  phone: string;
};

type Props = {
  students?: IStudentResponse[];
};

function StudentListTable({ students: defaultStudents }: Props) {
  const [studentTableRows, setStudentTableRows] = useState<IStudentTableRow[]>(
    [] as IStudentTableRow[]
  );
  const form = useForm<{ grade_id: number; section_id: number }>({});
  const gradeId = form.watch("grade_id");
  const sectionId = form.watch("section_id");

  const filter = { grade_id: gradeId, section_id: sectionId };
  const { data, isLoading } = useGetStudents(
    {
      enabled: isEmpty(defaultStudents),
    },
    filter
  );
  const students = defaultStudents || data?.students;

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
      queryClient.setQueryData(
        ["students", "all"],
        (oldData: StudentListDTO) => {
          if (oldData && oldData.students) {
            console.log(oldData.students);
            oldData.students = oldData.students.filter(
              (student) => student.id !== data.id
            );
            return oldData;
          }
          return oldData;
        }
      );
    },
  });

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

  useEffect(() => {
    if (students) {
      const rowData = students.map(
        (student) =>
          ({
            id: student.id,
            avatar: student.user.avatar,
            name: student.full_name,
            studentId: student.student_id,
            grade: student.grade.name,
            section: student.section.name,
            cohort: student.cohort.name,
            phone: student.user.phone,
          } as IStudentTableRow)
      );
      setStudentTableRows(rowData);
    }
  }, [students]);

  const columns: ColumnDef<IStudentTableRow>[] = useMemo(
    () => [
      {
        accessorKey: "avatar",
        header: () => <div className="text-center font-bold">Photo</div>,
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="flex justify-center">
              <Image
                width={64}
                height={64}
                alt="student avatar"
                src={student.avatar || "/assets/images/student-avatar.png"}
                className="rounded-full w-16 h-16 object-cover border border-slate-400"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: () => <div className="text-center font-bold">Student Name</div>,
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("name")}
          </div>
        ),
      },

      {
        accessorKey: "studentId",
        header: () => <div className="text-center font-bold">Student ID</div>,
        cell: ({ row }) => (
          <div
            className="text-center text-sm font-semibold
          "
          >
            <Badge variant="outline">{row.getValue("studentId")}</Badge>
          </div>
        ),
      },

      {
        accessorKey: "grade",
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="ghost"
                className="font-bold"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Grade
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">
            <Badge className="bg-green-800">{row.getValue("grade")}</Badge>
          </div>
        ),
      },
      {
        accessorKey: "section",
        header: ({ column }) => {
          return (
            <div className="text-center ">
              <Button
                variant="ghost"
                className="font-bold"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Section
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">
            <Badge className="bg-slate-600">{row.getValue("section")}</Badge>
          </div>
        ),
      },
      {
        accessorKey: "cohort",
        header: ({ column }) => {
          return (
            <div className="text-center ">
              <Button
                variant="ghost"
                className="font-bold"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Cohort
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">
            <Badge className="bg-orange-600">{row.getValue("cohort")}</Badge>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: () => <div className="text-center font-bold">Phone</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("phone")}</div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const student = row.original;

          return (
            <>
              <Popover>
                <PopoverTrigger>
                  <DotsHorizontalIcon className="w-4 h-4 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className=" z-[1]">
                  <div className="action-menu-container">
                    <Link
                      href={"/management/students/" + student.id}
                      className="flex gap-3  items-center  cursor-pointer hover:text-slate-700"
                    >
                      <Pencil1Icon
                        className="w-5 h-5"
                        onClick={() => {
                          console.log("clicked");
                        }}
                      />
                      <span>Edit</span>
                    </Link>
                    <Protected action="hide" roles={["ADMIN"]}>
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
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="p-2 lg:p-4">
      {/* <SearchFilter
        filterList={[
          { label: "name", value: "Name" },
          { label: "Class", value: "class" },
          { label: "Batch", value: "batch" },
        ]}
        onSearch={(filter, query) => console.log(filter, query)}
      /> */}

      <FormProvider {...form}>
        <div className="my-4 flex max-w-[268px]">
          <SelectGradeField disabled={isLoading} />
        </div>
      </FormProvider>

      {isLoading && <TableSkeleton />}
      {!isLoading && <DataTable data={studentTableRows} columns={columns} />}
    </div>
  );
}

export default StudentListTable;
