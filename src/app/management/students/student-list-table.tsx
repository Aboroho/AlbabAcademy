"use client";

import DataTable from "@/components/data-table";

// import SimpleDropDown from "@/components/primitives/SimplePopover";
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
// import SearchFilter from "@/components/data-table/SearchFilter";

import { useGetStudents } from "@/client-actions/queries/student-queries";
// import {
//   useDeleteStudent,
//   useUpdateStudentFullDetails,
// } from "@/client-actions/mutations/studentMutation";

import { IStudentResponse } from "@/types/response_types";
import { isEmpty } from "@/components/forms/form-utils";
import { Popover } from "@/components/shadcn/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Badge } from "@/components/shadcn/ui/badge";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { Protected } from "@/components/auth";

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
  const { data: fetchedStudents, isLoading } = useGetStudents({
    enabled: isEmpty(defaultStudents),
  });
  const students = defaultStudents || fetchedStudents;

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

  function handleDelete(id: number) {
    toast.success("Student deleted [not implemented yet]" + id);
  }

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

  if (isLoading) return <TableSkeleton />;
  return (
    <div className="p-8">
      {/* <SearchFilter
        filterList={[
          { label: "name", value: "Name" },
          { label: "Class", value: "class" },
          { label: "Batch", value: "batch" },
        ]}
        onSearch={(filter, query) => console.log(filter, query)}
      /> */}

      <DataTable
        data={studentTableRows}
        columns={columns}
        // loading={isLoading}
        // activeRowId={activeRowId}
      />
    </div>
  );
}

export default StudentListTable;
