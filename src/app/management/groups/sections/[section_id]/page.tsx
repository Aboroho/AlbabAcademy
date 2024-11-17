// import StudentDetailsForm from "@/components/forms/student-details-form";
import React from "react";
import UpdateFormContainer from "./update-form-container";

type Props = {
  params: Promise<{ section_id: string }>;
};
async function UpdateSection({ params }: Props) {
  const sectionId = (await params).section_id;
  return (
    <div>
      <UpdateFormContainer sectionId={Number(sectionId)} />
    </div>
  );
}

export default UpdateSection;
