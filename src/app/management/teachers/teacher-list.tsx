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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/client-actions/helper";
import { ITeacherResponse } from "@/types/response_types";
import { SelectInput } from "@/components/ui/single-select-input";

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
  const [designation, setDesignation] = useState<string | undefined>("");
  const { data, isLoading } = useGetTeachers();
  const queryClient = useQueryClient();
  const teachers = data;

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api("/teachers/" + id, {
        method: "DELETE",
      });
    },

    onSettled: (res) => {
      if (!res?.success) return;
      const data = res.data as { id: number };

      queryClient.invalidateQueries({ queryKey: ["teacher", "all"] });
      queryClient.setQueryData(
        ["teacher", "all"],
        (oldData: ITeacherResponse[]) => {
          if (oldData) {
            return oldData.filter((teacher) => teacher.id !== data.id);
          }
          return oldData;
        }
      );
    },
  });
  useEffect(() => {
    if (teachers) {
      const updatedTeachers = teachers.filter(
        (teacher) => designation === "" || teacher.designation === designation
      );
      const rowData = updatedTeachers.map(
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
  }, [teachers, designation]);

  async function handleDelete(id: number) {
    toast.loading("Deleting Staff...", { id: "delete-Staff" });
    try {
      const res = await deleteMutation.mutateAsync(id);
      if (res.success) {
        toast.success("Staff deleted");
      } else {
        toast.error("Failed to delete Staff");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      toast.dismiss("delete-Staff");
    }
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
        header: () => <div className="text-center font-bold">Staff Name</div>,
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
        header: () => <div className="text-center font-bold">Staff Status</div>,

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
                      <Pencil1Icon className="w-5 h-5" />
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
      <div className="py-4 w-1/4">
        <SelectInput
          selectedValue={designation}
          isLoading={isLoading}
          placeholder="Select Designation"
          onSelect={(value) => {
            setDesignation(value);
          }}
          triggerClassName="w-full"
          options={[
            {
              label: "Teacher",
              value: "TEACHER",
            },
            {
              label: "Principal",
              value: "PRINCIPAL",
            },
            {
              label: "Staff",
              value: "STAFF",
            },
            {
              label: "Director",
              value: "DIRECTOR",
            },
            {
              label: "Assistant Teacher",
              value: "ASSISTENT_TEACHER",
            },
            {
              label: "Accountant",
              value: "ACCOUNTANT",
            },
            {
              label: "Librarian",
              value: "LIBRARIAN",
            },
            {
              label: "Secretary",
              value: "SECRETARY",
            },
          ]}
          label={"Sort by Designation"}
        />
      </div>
      <DataTable data={teacherTableRows} columns={columns} />
    </div>
  );
}
export default TeacherListTable;
