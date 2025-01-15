import StudentDetailsForm from "@/components/forms/student-details-form";

function CreateStudentPage() {
  return (
    <div className="bg-white p-4 rounded-md">
      <StudentDetailsForm formTitle="Create  student" />
    </div>
  );
}

export default CreateStudentPage;
