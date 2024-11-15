import { NextRequest } from "next/server";
import { FieldValues, Path } from "react-hook-form";

export type ApiRoute = (
  req: NextRequest,
  params: Record<string, unknown>
) => Promise<void | Response>;

export interface User {
  username: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  phone: string;
  email?: string;
  avatar?: string;
  referenceId?: string | number;
}

export type SuccessfulApiResponse = {
  success: true;
  statusCode: number;
  data: unknown;
};
export type FailedApiResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorDetails?: unknown;
};

export type ApiResponse = SuccessfulApiResponse | FailedApiResponse;

export type FormDetailsProps<D, T extends FieldValues = FieldValues> = {
  renderButton?: (isSubmitting: boolean) => JSX.Element;
  updateId?: number;
  isLoading?: boolean;
  defaultData?: D;
  hiddenFields?: Path<T>[];
  hiddenSection?: string[];
  updateEnabled?: boolean;
  formTitle?: string;
};

export type CustomQueryOptions = {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
};
