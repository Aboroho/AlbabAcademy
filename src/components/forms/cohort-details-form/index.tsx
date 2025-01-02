"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  cohortCreateSchema,
  cohortUpdateSchema,
  ICohortCreateFormData,
  ICohortUpdateFormData,
} from "./schema";
import InputField from "@/components/ui/input-field";
import { ApiResponse, FormDetailsProps } from "@/types/common";
import {
  FormSection,
  isEmpty,
  isNotEmpty,
  noRecordFoundFallback,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
} from "../form-utils";
import { Button } from "@/components/button";
import { SelectGradeField, SelectSectionField } from "../common-fields";
import { ICohortResponseWithParent } from "@/types/response_types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCohort, updateCohort } from "./utils";

type FormData = (ICohortCreateFormData | ICohortUpdateFormData) & {
  grade_id: number;
};
function CohortDetailsFrom({
  renderButton,
  defaultData: cohort,
  formTitle,
  isLoading,
  updateId: cohortId,
  updateEnabled,
}: FormDetailsProps<ICohortResponseWithParent, FormData>) {
  const schema = updateEnabled ? cohortCreateSchema : cohortUpdateSchema;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: cohort ? cohort.name : "",
      section_id: cohort ? cohort.section_id : Infinity,
      description: cohort ? cohort.description : "",

      // only for form
      grade_id: cohort ? cohort.section.grade_id : Infinity,
    },
  });

  const reset = form.reset;
  const errors = form.formState.errors;

  // updating student's default field value
  useEffect(() => {
    console.log(cohort);
    if (isNotEmpty(cohort) && cohort) {
      reset({
        name: cohort.name,
        description: cohort.description,
        section_id: cohort.section_id,
        // only for form
        grade_id: cohort ? cohort.section.grade_id : Infinity,
      });
    }
  }, [cohort, reset]);

  // mutations
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: ICohortUpdateFormData) => {
      return await updateCohort(data, cohortId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: ICohortCreateFormData) => {
      return await createCohort(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      queryClient.invalidateQueries({ queryKey: ["student-groups", "all"] });
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(data as ICohortCreateFormData);
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(cohortId) || isEmpty(cohort)))
    return noRecordFoundFallback();

  const disableForm =
    !form.formState.isDirty ||
    form.formState.isSubmitting ||
    form.formState.isLoading;
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
      <div className="lg:w-1/2">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection>
              <InputField
                label="Cohort Name"
                placeholder="e.g., Cohort 2021"
                {...form.register("name")}
                error={errors.name}
              />
              <SelectGradeField />
              <SelectSectionField />
              <InputField
                placeholder="Cohort description"
                label="Description (optional)"
                {...form.register("description")}
              />
            </FormSection>
            <div className="mt-4">
              {renderButton ? (
                renderButton(disableForm)
              ) : (
                <Button type="submit" disabled={disableForm}>
                  Submit Cohort Info
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
export default CohortDetailsFrom;
