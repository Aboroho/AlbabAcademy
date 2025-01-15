import toast from "react-hot-toast";

import { api } from "@/client-actions/helper";
import { ICohortCreateFormData, ICohortUpdateFormData } from "./schema";

/**
 * Updates the data for a cohort.
 *
 * @param data - The updated cohort data.
 * @param cohortId - The ID of the cohort to update.
 * @returns The API response, or `undefined` if `cohortId` is falsy.
 */
export async function updateCohort(
  data: ICohortUpdateFormData,
  cohortId: number | undefined | null
) {
  if (!cohortId) return undefined;
  toast.loading("Updating cohort's data...", { id: "u-cohort" });
  try {
    const res = await api("/cohorts/" + cohortId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("cohorts's data updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-cohort");
  }
}

export async function createCohort(data: ICohortCreateFormData) {
  toast.loading("Creating cohort", { id: "c-cohort" });
  try {
    const res = await api("/cohorts", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("cohort created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-cohort");
  }
}
