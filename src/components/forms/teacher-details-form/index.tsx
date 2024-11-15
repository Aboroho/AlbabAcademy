"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  ITeacherCreateFormData,
  ITeacherUpdateFormData,
  teacherCreateSchema,
  teacherUpdateSchema,
} from "./schema";
import InputField from "@/components/ui/input-field";
import { ApiResponse, FormDetailsProps } from "@/types/common";
import { Button } from "@/components/button";
import { AddressFields, UserFields } from "../common-fields";
import {
  FormSection,
  isEmpty,
  isNotEmpty,
  noRecordFoundFallback,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
} from "../form-utils";

import { useEffect } from "react";
import {
  createTeacher,
  getTeacherDefaultCreateFormData,
  getTeacherDefaultUpdateFormData,
  updateTeacher,
} from "./utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITeacherResponse } from "@/types/response_types";

type FormData = ITeacherCreateFormData | ITeacherUpdateFormData;

function TeacherDetailsForm({
  renderButton,
  updateId: teacherId,
  defaultData: teacher,
  formTitle,
  isLoading,
  updateEnabled,
}: FormDetailsProps<ITeacherResponse, FormData>) {
  const schema = updateEnabled ? teacherUpdateSchema : teacherCreateSchema;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: isNotEmpty(teacher)
      ? getTeacherDefaultUpdateFormData(teacher)
      : getTeacherDefaultCreateFormData(),
  });

  const reset = form.reset;
  const errors = form.formState.errors;

  // updating student's default field value
  useEffect(() => {
    if (isNotEmpty(teacher)) {
      reset(getTeacherDefaultUpdateFormData(teacher));
    }
  }, [teacher, reset]);

  // mutations
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: ITeacherUpdateFormData) => {
      return await updateTeacher(data, teacherId);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: ITeacherCreateFormData) => {
      return await createTeacher(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(data as ITeacherCreateFormData);
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(teacherId) || isEmpty(teacher)))
    return noRecordFoundFallback();

  return (
    <div>
      {/* Form Title section */}
      <div>
        <h1 className="text-2xl mb-10 ">
          {formTitle || "Teacher Details Form"}
        </h1>
      </div>

      {/* Error Area */}
      {isNotEmpty(errors) && (
        <div className="p-4 rounded-md bg-red-100 mb-6 text-red-500">
          {showErrors(errors as { [key: string]: { message: string } })}
        </div>
      )}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="personal-details p-2 space-y-4">
              <FormSection title="Personal Details">
                <InputField
                  label="Teacher's name"
                  {...form.register("full_name")}
                  error={errors.full_name}
                />
                <InputField
                  label="Designation"
                  {...form.register("designation")}
                  error={errors.designation}
                />
                <InputField
                  label="Phone"
                  {...form.register("user.phone")}
                  error={errors.user?.phone}
                />
                <InputField
                  label="Subject Expertise (optional)"
                  {...form.register("subject_expertise")}
                  error={errors.subject_expertise}
                />
                <InputField
                  label="Short Description (optional)"
                  {...form.register("description")}
                  error={errors.description}
                />
              </FormSection>
              <AddressFields title="Teacher's Address" />
            </div>
            <div className="online-n-address p-2 space-y-4">
              <UserFields update={updateEnabled} />
              <div className="mt-auto">
                {renderButton ? (
                  renderButton(form.formState.isSubmitting)
                ) : (
                  <Button
                    isLoading={form.formState.isSubmitting}
                    type="submit"
                    className="mt-auto"
                  >
                    Submit Teacher&apos;s Data
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default TeacherDetailsForm;
