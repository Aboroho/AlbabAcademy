"use client";

import DataTable from "@/components/data-table";

// import SimpleDropDown from "@/components/primitives/SimplePopover";

import { DotsHorizontalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

import Link from "next/link";
// import SearchFilter from "@/components/data-table/SearchFilter";

import { Popover } from "@/components/shadcn/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

import AlertDialog from "@/components/ui/modal/AlertDialog";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { Protected } from "@/components/auth";
import { useGetTeachers } from "@/client-actions/queries/teacher-queries";
import { Badge } from "@/components/shadcn/ui/badge";

export type ITeacherRowTable = {
  id: number;
  avatar: string;
  name: string;
  phone: string;
  status: string;
  designation: string;
  expertise: string;
};

function TeacherListTable() {
  const [teacherTableRows, setTeacherTableRows] = useState<ITeacherRowTable[]>(
    [] as ITeacherRowTable[]
  );
  const { data, isLoading } = useGetTeachers();
  const teachers = data;
  // const studentCount = data?.count;

  console.log(teachers);

  useEffect(() => {
    if (teachers) {
      const rowData = teachers.map(
        (teacher) =>
          ({
            id: teacher.id,
            avatar: teacher.user.avatar,
            name: teacher.full_name,
            phone: teacher.user.phone,
            designation: teacher.designation,
            status: teacher.status,
            expertise: teacher.subject_expertise,
          } as ITeacherRowTable)
      );
      setTeacherTableRows(rowData);
    }
  }, [teachers]);

  function handleDelete(id: number) {
    toast.success("Student deleted [not implemented yet]" + id);
  }

  const columns: ColumnDef<ITeacherRowTable>[] = useMemo(
    () => [
      {
        accessorKey: "avatar",
        header: () => <div className="text-center font-bold">Photo</div>,
        cell: ({ row }) => {
          const teacher = row.original;
          return (
            <div className="flex justify-center">
              <Image
                width={64}
                height={64}
                alt="student avatar"
                src={teacher.avatar || "/assets/images/student-avatar.png"}
                className="rounded-full w-16 h-16 object-cover border border-slate-400"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: () => <div className="text-center font-bold">Teacher Name</div>,
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "designation",
        header: () => <div className="text-center font-bold">Designation</div>,
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            <span className="font-bold">{row.getValue("designation")}</span>
          </div>
        ),
      },
      {
        accessorKey: "expertise",
        header: () => (
          <div className="text-center font-bold">Subject Expertise</div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-semibold ">
            {row.getValue("expertise")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <div className="text-center font-bold">Teacher Status</div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            <Badge>{row.getValue("status")}</Badge>
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
          const teacher = row.original;

          return (
            <>
              <Popover>
                <PopoverTrigger>
                  <DotsHorizontalIcon className="w-4 h-4 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className=" z-[1]">
                  <div className="action-menu-container">
                    <Link
                      href={"/management/teachers/" + teacher.id}
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
                        onConfirm={() => handleDelete(teacher.id)}
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
    <div className="p-2 lg:p-4">
      {/* <SearchFilter
        filterList={[
          { label: "name", value: "Name" },
          { label: "Class", value: "class" },
          { label: "Batch", value: "batch" },
        ]}
        onSearch={(filter, query) => console.log(filter, query)}
      /> */}

      <DataTable
        data={teacherTableRows}
        columns={columns}
        // loading={isLoading}
        // activeRowId={activeRowId}
      />
    </div>
  );
}

export default TeacherListTable;
