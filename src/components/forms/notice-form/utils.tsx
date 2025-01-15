import toast from "react-hot-toast";
import { NoticeCreateFormData, NoticeUpdateFormData } from "./schema";
import { api } from "@/client-actions/helper";

export async function updateNotice(
  data: NoticeUpdateFormData,
  noticeId: number | undefined | null
) {
  if (!noticeId) return undefined;
  toast.loading("Updating notice...", {
    id: "u-notice",
  });
  try {
    const res = await api("/notice/" + noticeId, {
      method: "put",
      body: JSON.stringify(data),
    });
    if (res.success) toast.success("Notice updated successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("u-notice");
  }
}

export async function createNotice(data: NoticeCreateFormData) {
  toast.loading("Creating notice", { id: "c-notice" });
  try {
    const res = await api("/notice", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (res?.success) toast.success("Notice created successfully");
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    toast.dismiss("c-notice");
  }
}
