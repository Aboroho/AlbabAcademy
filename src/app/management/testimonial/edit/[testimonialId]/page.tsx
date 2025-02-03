import React from "react";
import UpdateFormContainer from "./update-testimonial";

type Props = {
  params: Promise<{ testimonialId: string }>;
};

async function EditTestimonial({ params }: Props) {
  const testimonialId = (await params).testimonialId;

  return (
    <div>
      <UpdateFormContainer testimonialId={parseInt(testimonialId)} />
    </div>
  );
}

export default EditTestimonial;
