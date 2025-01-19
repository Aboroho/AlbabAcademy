// import StudentDetailsForm from "@/components/forms/student-details-form";
import React from "react";
import UpdateFormContainer from "./update-form-container";

type Props = {
  params: Promise<{ noticeId: string }>;
};
async function UpdateStudent({ params }: Props) {
  const noticeId = (await params).noticeId;
  return (
    <div>
      <UpdateFormContainer noticeId={Number(noticeId)} />
    </div>
  );
}

export default UpdateStudent;
