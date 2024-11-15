// import StudentDetailsForm from "@/components/forms/student-details-form";
import React from "react";
import UpdateFormContainer from "./update-form-container";

type Props = {
  params: Promise<{ student_id: string }>;
};
async function UpdateStudent({ params }: Props) {
  const studentId = (await params).student_id;
  return (
    <div>
      <UpdateFormContainer studentId={Number(studentId)} />
    </div>
  );
}

export default UpdateStudent;
