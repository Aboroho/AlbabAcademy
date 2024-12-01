import React from "react";

type Props = {
  params: Promise<{ student_id: string }>;
};

async function StudentProfilePage({ params }: Props) {
  const studentId = parseInt((await params).student_id);

  return <div>Student Profile {studentId}</div>;
}

export default StudentProfilePage;
