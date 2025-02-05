"use client";

import { useGetCurriculumById } from "@/client-actions/queries/curriculum-queries";

import { Button } from "@/components/button";
import CurriculumDetailsForm from "@/components/forms/curriculum-details-form";

import React from "react";

type Props = {
  curriculumId: number;
};

function UpdateFormContainer({ curriculumId }: Props) {
  const { data: curriculum, isLoading } = useGetCurriculumById(curriculumId);

  return (
    <div>
      <CurriculumDetailsForm
        updateId={curriculumId}
        defaultData={curriculum}
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
