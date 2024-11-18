import { api } from "@/client-actions/helper";
import { IStudentCreateFormData, IStudentUpdateFormData } from "./schema";

import toast from "react-hot-toast";
import { IStudentResponse } from "@/types/response_types";
import { omitFields } from "@/app/api/utils/excludeFields";

export async function updateStudent(
  data: IStudentUpdateFormData,
  studentId: number | undefined | null
) {
  if (!studentId) return undefined;
  toast.loading("Updating student...", { id: "u-student" });
  try {
    const res = await api("/students/" + studentId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("Student updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-student");
  }
}

export async function createStudent(data: IStudentCreateFormData) {
  toast.loading("Creating student", { id: "c-student" });
  try {
    const res = await api("/students", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("Created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-student");
  }
}

export function getStudentDefaultCreateFormData(): IStudentCreateFormData {
  const res: IStudentCreateFormData = {
    full_name: "",
    cohort_id: Infinity,
    section_id: Infinity,
    grade_id: Infinity,
    date_of_birth: "",
    father_name: "",
    gender: "MALE",
    guardian_phone: "",
    mother_name: "",
    residential_status: "NON_RESIDENTIAL",
    roll: Infinity,
    student_id: "",
    user: {
      password: "",
      phone: "",
      username: "",
      avatar: "",
      email: null,
    },
    address: {
      district: null,
      sub_district: null,
      union: null,
      village: null,
    },
  };
  return res;
}

export function getStudentDefaultUpdateFormData(
  student?: IStudentResponse
): IStudentUpdateFormData {
  if (!student) return {} as IStudentUpdateFormData;

  const data: IStudentUpdateFormData = {
    ...omitFields(student, [
      "address_id",
      "grade",
      "section",
      "cohort",
      "user_id",
    ]),
    student_id: student.student_id,
    grade_id: student.grade.id,
    section_id: student.section.id,
    date_of_birth: new Date(student.date_of_birth),
  };
  return data;
}

// export function goNextInputOnEnter(e : React.KeyboardEvent<HTMLInputElement>){
//   if (e.key === 'Enter'){
//     e.preventDefault()
//     const form = e.currentTarget.form;
//     if(!form) return;
//     const index = Array.from(form.elements).indexOf(e.currentTarget);
//     form.elements[index + 1]?.focus();
//   }
// }
