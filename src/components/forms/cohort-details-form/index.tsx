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
} from "../form-utils";
import { Button } from "@/components/button";
import { SelectGradeField, SelectSectionField } from "../common-fields";
import {
  ICohortResponse,
  ICohortResponseWithParent,
} from "@/types/response_types";
import { useMutation } from "@tanstack/react-query";
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
  const updateMutation = useMutation({
    mutationFn: async (data: ICohortUpdateFormData) => {
      return await updateCohort(data, cohortId);
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: ICohortCreateFormData) => {
      return await createCohort(data);
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

  return (
    <div>
      <div className="lg:max-w-1/2">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection>
              <InputField
                label="Cohort Name"
                {...form.register("name")}
                error={errors.name}
              />
              <SelectGradeField />
              <SelectSectionField />
              <InputField
                label="Description (optional)"
                {...form.register("description")}
              />
            </FormSection>
            <div>
              {renderButton ? (
                renderButton(form.formState.isSubmitting)
              ) : (
                <Button type="submit">Submit Cohort Info</Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
export default CohortDetailsFrom;
