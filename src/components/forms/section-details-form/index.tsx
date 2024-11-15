"use client";
import { ApiResponse, FormDetailsProps } from "@/types/common";
import React, { useEffect } from "react";
import {
  ISectionCreateFormData,
  ISectionUpdateFormData,
  sectionCreateSchema,
  sectionUpdateSchema,
} from "./schema";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/ui/input-field";
import { SelectInput } from "@/components/ui/single-select-input";

import { useGetTeachers } from "@/client-actions/queries/teacher-queries";
import { SelectGradeField } from "../common-fields";
import { Button } from "@/components/button";
import {
  FormSection,
  isEmpty,
  isNotEmpty,
  noRecordFoundFallback,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
  valueAsIntF,
} from "../form-utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { ISectionResponse } from "@/types/response_types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSection, updateSection } from "./utils";

type FormData = ISectionCreateFormData | ISectionUpdateFormData;

function SectionDetailsForm({
  renderButton,
  defaultData: section,
  formTitle,
  isLoading,
  updateId: sectionId,
  updateEnabled,
}: FormDetailsProps<ISectionResponse, FormData>) {
  const schema = updateEnabled ? sectionCreateSchema : sectionUpdateSchema;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: section ? section.name : "",
      class_teacher_id: section ? section.class_teacher_id : null,
      grade_id: section ? section.grade_id : Infinity,
    },
  });

  const reset = form.reset;
  const errors = form.formState.errors;

  // updating student's default field value
  useEffect(() => {
    if (isNotEmpty(section) && section) {
      reset({
        name: section.name,
        class_teacher_id: section.class_teacher_id,
        grade_id: section.grade_id,
      });
    }
  }, [section, reset]);

  // mutations
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: ISectionUpdateFormData) => {
      return await updateSection(data, sectionId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: ISectionCreateFormData) => {
      return await createSection(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });

  const { data: teachers } = useGetTeachers({
    enabled: !(updateEnabled && isEmpty(section)),
  });
  const classTeacherId = form.watch("class_teacher_id");

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(data as ISectionCreateFormData);
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(sectionId) || isEmpty(section)))
    return noRecordFoundFallback();
  return (
    <div>
      {/* Form Title section */}
      <div>
        <h1 className="text-2xl mb-10 ">
          {formTitle || "Sectioin Details Form"}
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
          <FormSection title="Section Details">
            <InputField
              label="Section Name"
              error={form.formState.errors.name}
              {...form.register("name")}
            />

            <SelectGradeField />

            <Controller
              control={form.control}
              name="class_teacher_id"
              render={({ field }) => (
                <SelectInput
                  triggerClassName="w-full"
                  label="Select Class Teacher (optional)"
                  onSelect={valueAsIntF(field.onChange)}
                  options={teachers?.map((teacher) => ({
                    label: teacher.full_name,
                    value: teacher.id.toString(),
                    avatar: teacher.user.avatar,
                  }))}
                  selectedValue={classTeacherId?.toString()}
                  renderOption={(option, isSlected) => (
                    <div
                      className={cn(
                        "w-full p-1 rounded-sm px-2 flex gap-4 items-center",
                        isSlected && "bg-green-200 "
                      )}
                    >
                      <Image
                        src={
                          (option.avatar as string) ||
                          "/assets/images/teacher_avatar.jpg"
                        }
                        width={40}
                        height={40}
                        alt="Teacher image"
                        className="border  w-[40px] h-[40px]"
                      />
                      {option.label}
                    </div>
                  )}
                />
              )}
            />
          </FormSection>

          <div>
            {renderButton ? (
              renderButton(form.formState.isSubmitting)
            ) : (
              <Button type="submit">Submit Section Info</Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default SectionDetailsForm;
