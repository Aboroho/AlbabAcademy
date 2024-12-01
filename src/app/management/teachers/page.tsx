import React from "react";
import TeacherListTable from "./teacher-list";

type Props = {};

function TeacherListPage({}: Props) {
  return (
    <div>
      <h1 className="text-xl mb-4">Teacher's List</h1>
      <TeacherListTable />
    </div>
  );
}

export default TeacherListPage;
