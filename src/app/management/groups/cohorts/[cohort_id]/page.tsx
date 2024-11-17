// import StudentDetailsForm from "@/components/forms/student-details-form";
import React from "react";
import UpdateFormContainer from "./update-form-container";

type Props = {
  params: Promise<{ cohort_id: string }>;
};
async function UpdateCohort({ params }: Props) {
  const cohortId = (await params).cohort_id;
  return (
    <div>
      <UpdateFormContainer cohortId={Number(cohortId)} />
    </div>
  );
}

export default UpdateCohort;
