import { GraduationCap } from "lucide-react";
import StudentListTable from "./student-list-table";
import { Protected } from "@/components/auth";

function StudentList() {
  return (
    <Protected
      roles={["ADMIN", "TEACHER"]}
      action="redirect"
      redirectPath={`/management/dashboard`}
    >
      <div>
        <div className="flex gap-4">
          <GraduationCap className="w-10 h-10" />
          <h1 className="text-2xl">Student List</h1>
        </div>

        <StudentListTable />
      </div>
    </Protected>
  );
}

export default StudentList;
