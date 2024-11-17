"use client";
import { useGetCohortById } from "@/client-actions/queries/student-queries";
import CohortDetailsFrom from "@/components/forms/cohort-details-form";

type Props = {
  cohortId: number;
};

function UpdateFormContainer({ cohortId }: Props) {
  const { data: cohort, isLoading } = useGetCohortById(cohortId);

  return (
    <div>
      <CohortDetailsFrom
        updateId={cohortId}
        defaultData={cohort}
        isLoading={isLoading}
        updateEnabled={true}
        formTitle="Update Cohort"
      />
    </div>
  );
}

export default UpdateFormContainer;
