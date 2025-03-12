import { ITeacherResponse } from "@/types/response_types";
import { ITeacherCreateFormData, ITeacherUpdateFormData } from "./schema";
import { omitFields } from "@/app/api/utils/excludeFields";
import { defaultAddressField, defaultUserField } from "../common-fields";
import toast from "react-hot-toast";
import { api } from "@/client-actions/helper";
import { Designation } from "@prisma/client";

export async function updateTeacher(
  data: ITeacherUpdateFormData,
  teacherId: number | undefined | null
) {
  if (!teacherId) return undefined;
  toast.loading("Updating teacher's data...", { id: "u-teacher" });
  try {
    const res = await api("/teachers/" + teacherId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("Teacher's data updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-teacher");
  }
}

export async function createTeacher(data: ITeacherCreateFormData) {
  toast.loading("Creating teacher", { id: "c-teacher" });
  try {
    const res = await api("/teachers", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("Teacher created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-teacher");
  }
}

export function getTeacherDefaultCreateFormData(): ITeacherCreateFormData {
  return {
    address: defaultAddressField,
    designation: "TEACHER",
    full_name: "",
    user: defaultUserField,
    date_of_joining: null,
    description: "",
    qualification: "",
    subject_expertise: "",
  };
}

export function getTeacherDefaultUpdateFormData(
  teacher?: ITeacherResponse
): ITeacherUpdateFormData {
  if (!teacher) return {} as ITeacherUpdateFormData;

  return {
    ...omitFields(teacher, ["address_id", "user_id", "grades", "id"]),
    date_of_joining: teacher.date_of_joining
      ? new Date(teacher.date_of_joining || "")
      : null,
    designation: teacher.designation as Designation,
  };
}
