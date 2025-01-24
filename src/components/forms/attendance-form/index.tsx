"use client";
import React, { useEffect, useState } from "react";
import { AttendanceBaseFormData, attendanceBaseSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AttendanceStatusInput from "./attendance-status-input";
import { DatePicker } from "@/components/ui/date-picker";
import { SelectInput } from "@/components/ui/single-select-input";
import { useGetCohortList } from "@/client-actions/queries/student-queries";
import { valueAsIntF } from "../form-utils";
import { useGetAttendanceList } from "@/client-actions/queries/attendance-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/client-actions/helper";
import { Button } from "@/components/button";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

type Props = {};

type FormData = AttendanceBaseFormData;

function AttendanceForm({}: Props) {
  const [cohortId, setCohortId] = useState<number | undefined>();

  const form = useForm<FormData>({
    resolver: zodResolver(attendanceBaseSchema),
    defaultValues: {
      date: new Date(),
      data: [],
    },
  });

  const { data: cohortList, isLoading: cohortListLoading } = useGetCohortList();

  const {
    data: attendanceList,
    isLoading,
    key,
  } = useGetAttendanceList({
    cohortId: cohortId,
    date: form.watch("date"),
  });

  useEffect(() => {
    if (attendanceList) {
      form.setValue(
        "data",
        attendanceList?.map((student) => ({
          student_id: student.id,
          status: (student.attendance_record?.[0]?.status || "NO_DATA") as
            | "PRESENT"
            | "ABSENT"
            | "NO_DATA",
        }))
      );
    }
  }, [form, attendanceList]);

  const queryClient = useQueryClient();

  const attendanceMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api("/attendance", {
        method: "post",
        body: JSON.stringify({
          date: format(data.date, "yyyy-MM-dd"),
          data: data.data.map((student) => ({
            student_id: student.student_id,
            status: student.status,
          })),
        }),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const attendanceData = form.watch("data");

  const present = attendanceData?.filter(
    (student) => student.status === "PRESENT"
  );
  const absent = attendanceData?.filter(
    (student) => student.status === "ABSENT"
  );
  const noData = attendanceData?.filter(
    (student) => student.status === "NO_DATA"
  );

  async function onSubmit(data: FormData) {
    toast.loading("Submitting attendance", { id: "submitting-attendance" });
    try {
      const res = await attendanceMutation.mutateAsync(data);

      if (res.success) {
        toast.success("Attendance submitted successfully");
      } else {
        toast.error("Failed to submit attendance");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to submit attendance");
    } finally {
      toast.remove("submitting-attendance");
    }
  }
  return (
    <div>
      <h1 className="text-2xl mb-4 px-4">Attendance</h1>
      <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-white rounded-md ">
        <div>
          <h2 className="text-md font-semibold mb-2">Date</h2>
          <DatePicker
            className="max-w-[350px] w-full"
            defaultDate={form.watch("date")}
            onSelect={(date) => {
              form.setValue("date", date);
            }}
          />
        </div>
        <div className="flex-1 max-w-[350px]">
          <SelectInput
            selectedValue={cohortId?.toString()}
            isLoading={cohortListLoading}
            label="Cohort/Group"
            placeholder="Select Cohort"
            onSelect={valueAsIntF(setCohortId)}
            triggerClassName="w-full"
            options={cohortList?.map((cohort) => ({
              label: cohort.name,
              value: cohort.id.toString(),
            }))}
          />
        </div>
      </div>

      <div className="p-4 bg-white mb-6">
        <div className="flex gap-4">
          <div className="bg-green-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
            Present <span className="text-xl">{present?.length}</span>
          </div>
          <div className="bg-red-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
            Absent <span className="text-xl">{absent.length}</span>
          </div>
          <div className="bg-gray-500 p-4 px-8 rounded-md text-white flex flex-col items-center">
            No Entry <span className="text-xl">{noData?.length}</span>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-white p-4 max-h-[50vh] overflow-y-scroll">
        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex justify-between  pb-2">
            <span className="font-semibold pl-2">Name</span>
            <span className="font-semibold">Roll</span>
            <span className="font-semibold pr-2">Status</span>
          </div>
          {isLoading && <div>Loading...</div>}
          {!isLoading && (!attendanceList || attendanceList.length == 0) && (
            <div className="text-sm text-gray-400 text-center">
              No data found
            </div>
          )}
          {attendanceList?.map((student, index) => {
            return (
              <div
                key={student.id}
                className="border rounded-md p-4 flex justify-between"
              >
                <div className="flex-1">{student.full_name}</div>
                <div className="flex-1 text-center">{student.roll}</div>
                <div className="flex-1 text-right">
                  <div className="inline-block">
                    <AttendanceStatusInput
                      status={attendanceData[index]?.status}
                      onChangeStatus={(status) => {
                        form.setValue(`data.${index}.status`, status);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="text-right mt-6">
            <Button type="submit">
              Submit Attendance <ArrowRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendanceForm;
