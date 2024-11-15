"use client";
import { useGetSectionById } from "@/client-actions/queries/student-queries";
import SectionDetailsForm from "@/components/forms/section-details-form";

type Props = {
  sectionId: number;
};

function UpdateFormContainer({ sectionId }: Props) {
  const { data: section, isLoading } = useGetSectionById(sectionId);
  console.log(section, sectionId);
  return (
    <div>
      <SectionDetailsForm
        updateId={sectionId}
        defaultData={section}
        isLoading={isLoading}
        updateEnabled={true}
        formTitle="Update Grade"
      />
    </div>
  );
}

export default UpdateFormContainer;
