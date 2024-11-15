"use client";
import { useGetStudentById } from "@/client-actions/queries/student-queries";

import StudentDetailsForm from "@/components/forms/student-details-form";
import React from "react";

type Props = {
  studentId: number;
};

function UpdateFormContainer({ studentId }: Props) {
  const { data: student, isLoading } = useGetStudentById(studentId);

  return (
    <div>
      <StudentDetailsForm
        updateId={studentId}
        defaultData={student}
        isLoading={isLoading}
        updateEnabled={true}
      />
    </div>
  );
}

export default UpdateFormContainer;
