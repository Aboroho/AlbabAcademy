import React from "react";
import UpdateFormContainer from "./update-curriculum";

type Props = {
  params: Promise<{ curriculumId: string }>;
};

async function EditTestimonial({ params }: Props) {
  const curriculumId = (await params).curriculumId;

  return (
    <div>
      <UpdateFormContainer curriculumId={parseInt(curriculumId)} />
    </div>
  );
}

export default EditTestimonial;
