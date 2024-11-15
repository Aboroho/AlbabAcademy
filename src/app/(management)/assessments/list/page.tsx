// import { api } from "@/client-actions/helper";
// import { IAssessmentsResponse } from "@/client-actions/queries/assessment-queries";
// import { cookies } from "next/headers";

async function AssessmentList() {
  //   const cookieStore = await cookies();
  //   const access_token = cookieStore.get("access_token")?.value;
  //   const res = await api("/assessment", {
  //     method: "get",
  //     headers: {
  //       Cookie: `access_token=${access_token}`,
  //     },
  //   });
  //   const assessments = res.success ? (res.data as IAssessmentsResponse) : [];

  return (
    <div>
      <div className="assessment-list flex flex-col gap-4">
        {/* {assessments.map((ass) => (
          <div key={ass.id} className="flex gap-2 p-4 bg-green-300">
            <div>{ass.title}</div>
            <div>
              {ass.assessment_subjects.map((sub, index) => (
                <div key={sub.id}>
                  {index}.{sub.subject_name}
                </div>
              ))}
            </div>
          </div>
        ))} */}
        Not implemented yet
      </div>
    </div>
  );
}

export default AssessmentList;
