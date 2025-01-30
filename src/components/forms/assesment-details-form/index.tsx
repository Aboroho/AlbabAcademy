"use client";

import { assessmentDetailsFormSchema, IAssessmentDetailsForm } from "./schema";
import {
  Controller,
  FieldError,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resolveFormError, FormSection } from "../form-utils";
import InputField from "@/components/ui/input-field";
import { SelectGradeField } from "../common-fields";
import { Button } from "@/components/button";
import { useEffect } from "react";
import { Calendar, PlusIcon } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useGetTeachers } from "@/client-actions/queries/teacher-queries";
import { SelectInput } from "@/components/ui/single-select-input";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/client-actions/helper";

import toast from "react-hot-toast";
import { DateInput } from "@/components/ui/date-input-2";
import { cn } from "@/lib/utils";
import { MultiSelectInput } from "@/components/ui/multiselect-input";
import { useGetSectionList } from "@/client-actions/queries/student-queries";

import InputTextArea from "@/components/ui/input-textarea";

export function AssementDetailsForm() {
  const form = useForm<IAssessmentDetailsForm>({
    mode: "onChange",
    resolver: zodResolver(assessmentDetailsFormSchema),
    defaultValues: {
      date: new Date(),
    },
  });
  const {
    fields: subjectList,
    prepend,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "assessment_subjects",
  });
  const errors = form.formState.errors;

  const subjects = form.watch("assessment_subjects");

  useEffect(() => {
    prepend({ subject_name: "", total_marks: 100, teacher_id: undefined });
  }, [prepend]);

  const { data: teachers } = useGetTeachers();
  const { data: sections, isLoading: isSectionLoading } = useGetSectionList(
    { enabled: !!form.watch("grade_id") },
    { gradeId: form.watch("grade_id") }
  );

  const gradeId = form.watch("grade_id");

  useEffect(() => {
    form.setValue("section_ids", []);
  }, [gradeId, form]);

  // mutations
  const createMutation = useMutation({
    mutationFn: async (data: IAssessmentDetailsForm) => {
      const res = await api("/assessments", {
        method: "post",
        body: JSON.stringify(data),
      });
      return res;
    },
  });

  async function onSubmit(data: IAssessmentDetailsForm) {
    toast.loading("Creating assessment....", { id: "c-assessment" });
    const res = await createMutation.mutateAsync(data);
    toast.dismiss("c-assessment");
    if (!res.success) return resolveFormError(res, form);
    toast.success("Assessment Created successfully");
  }

  console.log(errors);
  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 gap-6 bg-white">
            <FormSection title="Assessment Info ">
              <InputField
                {...form.register("title")}
                label="Assessment title"
                error={errors.title}
              />
              <SelectGradeField />
              <Controller
                control={form.control}
                name="section_ids"
                render={({ field }) => (
                  <MultiSelectInput
                    ref={field.ref}
                    onBlur={field.onBlur}
                    label="Section"
                    placeholder={
                      form.watch("grade_id")
                        ? "Select Section"
                        : "Select Grade First"
                    }
                    onValueChange={(value) => {
                      field.onChange(value.map((v) => parseInt(v)));
                      console.log(value);
                    }}
                    defaultValue={form
                      .watch("section_ids")
                      ?.map((v) => v.toString())}
                    options={
                      sections?.map((section) => ({
                        label: section.name,
                        value: section.id.toString(),
                      })) || []
                    }
                    error={form.formState.errors.section_ids as FieldError}
                    disabled={!form.watch("grade_id")}
                    isLoading={isSectionLoading}
                  />
                )}
              />
              <InputField
                label="Assessment Type"
                {...form.register("assessment_type")}
                error={errors.assessment_type}
              />

              <div>
                <div className="label mb-2">
                  <label
                    className={cn(
                      "font-semibold",
                      form.formState.errors.date && "text-red-500"
                    )}
                  >
                    Exam Date (dd/mm/yyyy)
                  </label>
                </div>
                <Controller
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <DateInput
                      icon={<Calendar className="w-4 h-4" />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                    />
                  )}
                />
                {form.formState.errors.date && (
                  <div className="text-red-500 text-sm mt-2">
                    {form.formState.errors.date?.message}
                  </div>
                )}
              </div>

              <InputTextArea
                label="Assessment Details"
                {...form.register("description")}
                error={errors.description}
                rows={4}
              />

              <div className="mt-4">
                <Button type="submit">Submit Assessment</Button>
              </div>
            </FormSection>

            <FormSection title="Add Subjects for the Assessment">
              <div className="subjects">
                <Button
                  size="sm"
                  onClick={() =>
                    prepend({ subject_name: "", total_marks: 100 })
                  }
                  className="mb-4 bg-green-600"
                  type="button"
                >
                  Add New Subject <PlusIcon className="w-4 h-4" />
                </Button>
                {errors.assessment_subjects?.message && (
                  <div className="p-4 rounded-md bg-red-100 text-red-500">
                    {errors.assessment_subjects.message}
                  </div>
                )}
                <div
                  className="space-y-5"
                  aria-details="Subject for the assessment"
                >
                  {subjectList.map((subject, index) => (
                    <div
                      key={subject.id}
                      className="flex items-start w-full gap-3"
                    >
                      <InputField
                        label="Subject Name"
                        {...form.register(
                          `assessment_subjects.${index}.subject_name`
                        )}
                        error={
                          errors.assessment_subjects?.[index]?.subject_name
                        }
                      />

                      <Controller
                        control={form.control}
                        name={`assessment_subjects.${index}.total_marks`}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                            label="Total Marks"
                            error={
                              errors.assessment_subjects?.[index]?.total_marks
                            }
                            type="number"
                          />
                        )}
                      />
                      <Controller
                        control={form.control}
                        name={`assessment_subjects.${index}.teacher_id`}
                        render={({ field }) => (
                          <SelectInput
                            selectedValue={subjects[
                              index
                            ].teacher_id?.toString()}
                            options={teachers?.map((teacher) => ({
                              label: teacher.full_name,
                              value: teacher.id.toString(),
                            }))}
                            label="Assign Teacher (Optional)"
                            onSelect={(teacherId) => {
                              if (teacherId)
                                field.onChange(parseInt(teacherId));
                            }}
                            emptyText="No teacher's found"
                            placeholder="Select Teacher "
                            rightIcon={
                              subjects.length > 1 ? (
                                <Cross1Icon
                                  className="w-4 h-4 cursor-pointer text-red-500"
                                  onClick={() => remove(index)}
                                />
                              ) : (
                                <></>
                              )
                            }
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
