"use client";

import { useGetTestimonialById } from "@/client-actions/queries/testimonial-queries";
import { Button } from "@/components/button";

import TestimonialDetailsForm from "@/components/forms/testimonial-details-form";
import React from "react";

type Props = {
  testimonialId: number;
};

function UpdateFormContainer({ testimonialId }: Props) {
  const { data: testimonial, isLoading } = useGetTestimonialById(testimonialId);

  return (
    <div>
      <TestimonialDetailsForm
        updateId={testimonialId}
        defaultData={testimonial}
        isLoading={isLoading}
        updateEnabled={true}
        renderButton={(isSubmitting) => {
          return (
            <Button type="submit" disabled={isSubmitting}>
              Update Testimonial
            </Button>
          );
        }}
      />
    </div>
  );
}

export default UpdateFormContainer;
