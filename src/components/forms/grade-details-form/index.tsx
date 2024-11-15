import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  gradeCreateSchema,
  gradeUpdateSchema,
  IGradeCreateFormData,
  IGradeUpdateFormData,
} from "./schema";
import InputField from "@/components/ui/input-field";
import {
  FormSection,
  isEmpty,
  isNotEmpty,
  noRecordFoundFallback,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
} from "../form-utils";

import { ApiResponse, FormDetailsProps } from "@/types/common";
import { Button } from "@/components/button";
import toast from "react-hot-toast";
import { IGradeResponse } from "@/types/response_types";
import { useMutation } from "@tanstack/react-query";
import { createGrade, updateGrade } from "./utils";
import CreateGrade from "@/app/(management)/groups/grades/create/page";

type FormData = IGradeCreateFormData | IGradeUpdateFormData;
function GradeDetailsForm({
  renderButton,
  defaultData: grade,
  formTitle,
  isLoading,
  updateId: gradeId,
  updateEnabled,
}: FormDetailsProps<IGradeResponse, FormData>) {
  const schema = updateEnabled ? gradeUpdateSchema : gradeCreateSchema;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: grade ? grade.name : "",
    },
  });

  const reset = form.reset;
  const errors = form.formState.errors;

  // updating student's default field value
  useEffect(() => {
    if (isNotEmpty(grade)) {
      reset({ name: grade?.name });
    }
  }, [grade, reset]);

  // mutations
  const updateMutation = useMutation({
    mutationFn: async (data: IGradeUpdateFormData) => {
      return await updateGrade(data, gradeId);
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: IGradeCreateFormData) => {
      return await createGrade(data);
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(data as IGradeUpdateFormData);
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(gradeId) || isEmpty(grade)))
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormSection>
          <InputField label="Grade Name" {...form.register("name")} />
        </FormSection>
        <div>
          {renderButton ? (
            renderButton(form.formState.isSubmitting)
          ) : (
            <Button type="submit">Submit Grade Info</Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GradeDetailsForm;
