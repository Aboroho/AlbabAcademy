"use client";

import { useGetTeacherById } from "@/client-actions/queries/teacher-queries";

import TeacherDetailsForm from "@/components/forms/teacher-details-form";
import React from "react";

type Props = {
  teacherId: number;
};

function UpdateFormContainer({ teacherId }: Props) {
  const { data: teacher, isLoading } = useGetTeacherById(teacherId);

  return (
    <div>
      <TeacherDetailsForm
        updateId={teacherId}
        defaultData={teacher}
        isLoading={isLoading}
        updateEnabled={true}
      />
    </div>
  );
}

export default UpdateFormContainer;
