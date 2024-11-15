"use client";
import { useGetGradeById } from "@/client-actions/queries/student-queries";
import GradeDetailsForm from "@/components/forms/grade-details-form";

type Props = {
  gradeId: number;
};

function UpdateFormContainer({ gradeId }: Props) {
  const { data: grade, isLoading } = useGetGradeById(gradeId);

  return (
    <div>
      <GradeDetailsForm
        updateId={gradeId}
        defaultData={grade}
        isLoading={isLoading}
        updateEnabled={true}
        formTitle="Update Grade"
      />
    </div>
  );
}

export default UpdateFormContainer;
