import React from "react";
import AssessmentPage from "./assessment-page";

type Props = {
  params: Promise<{ assessmentId: string; subjectId: string }>;
};

async function Page({ params }: Props) {
  const assessmentId = Number((await params).assessmentId);
  const subjectId = Number((await params).subjectId);
  return <AssessmentPage subjectId={subjectId} assessmentId={assessmentId} />;
}

export default Page;
