import toast from "react-hot-toast";
import { ISectionCreateFormData, ISectionUpdateFormData } from "./schema";
import { api } from "@/client-actions/helper";

export async function updateSection(
  data: ISectionUpdateFormData,
  sectionId: number | undefined | null
) {
  if (!sectionId) return undefined;
  toast.loading("Updating section's data...", { id: "u-section" });
  try {
    const res = await api("/sections/" + sectionId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("Sectioin's data updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-section");
  }
}

export async function createSection(data: ISectionCreateFormData) {
  toast.loading("Creating section", { id: "c-section" });
  try {
    const res = await api("/sections", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("Section created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-section");
  }
}
