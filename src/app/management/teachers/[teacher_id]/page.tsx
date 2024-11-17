// import StudentDetailsForm from "@/components/forms/student-details-form";
import React from "react";
import UpdateFormContainer from "./update-form-container";

type Props = {
  params: Promise<{ teacher_id: string }>;
};
async function UpdateStudent({ params }: Props) {
  const teacherId = (await params).teacher_id;
  return (
    <div>
      <UpdateFormContainer teacherId={Number(teacherId)} />
    </div>
  );
}

export default UpdateStudent;
