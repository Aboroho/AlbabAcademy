import { BASE_URL } from "@/lib/constants";
import { ApiResponse } from "@/types/common";

export const api = async (route: string, options: RequestInit) => {
  const baseUrl = "/api/v1";

  const url = baseUrl + route;
  try {
    const res = await fetch(url, options);
    const data: ApiResponse = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const UploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api("/uploader", {
    method: "post",
    body: formData,
  });
  return res;
};

export const DEFAULT_QUERY_FILTER = {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
};
