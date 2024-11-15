import toast from "react-hot-toast";
import { IGradeCreateFormData, IGradeUpdateFormData } from "./schema";
import { api } from "@/client-actions/helper";

export async function updateGrade(
  data: IGradeUpdateFormData,
  gradeId: number | undefined | null
) {
  if (!gradeId) return undefined;
  toast.loading("Updating grade's data...", { id: "u-grade" });
  try {
    const res = await api("/grades/" + gradeId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("Grades's data updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-grade");
  }
}

export async function createGrade(data: IGradeCreateFormData) {
  toast.loading("Creating grade", { id: "c-grade" });
  try {
    const res = await api("/grades", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("Grade created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-grade");
  }
}
