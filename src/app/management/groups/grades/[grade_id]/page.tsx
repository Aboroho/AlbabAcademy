// import StudentDetailsForm from "@/components/forms/student-details-form";
import React from "react";
import UpdateFormContainer from "./update-form-container";

type Props = {
  params: Promise<{ grade_id: string }>;
};
async function UpdateGrade({ params }: Props) {
  const gradeId = (await params).grade_id;
  return (
    <div>
      <UpdateFormContainer gradeId={Number(gradeId)} />
    </div>
  );
}

export default UpdateGrade;
