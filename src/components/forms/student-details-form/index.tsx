"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  IStudentCreateFormData,
  IStudentUpdateFormData,
  studentCreateSchema,
  studentUpdateSchema,
} from "./schema";
import InputField from "@/components/ui/input-field";
import { Button } from "@/components/button";

import { StudentDateOfBirthField, StudentRollField } from "./form-fields";
import { ApiResponse, FormDetailsProps } from "@/types/common";

import {
  isEmpty,
  isNotEmpty,
  noRecordFoundFallback,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
} from "../form-utils";

import {
  AddressFields,
  PaymentOnEnrollRefType,
  SelectCohortField,
  SelectGenderField,
  SelectGradeField,
  SelectSectionField,
  UserFields,
} from "../common-fields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStudent,
  getStudentDefaultCreateFormData,
  getStudentDefaultUpdateFormData,
  updateStudent,
} from "./utils";

// import { AlertCircleIcon } from "lucide-react";
import { StudentDTO } from "@/app/api/services/types/dto.types";
import { StudentProfileViewModel } from "@/client-actions/queries/student-queries";

type FormData = IStudentCreateFormData | IStudentUpdateFormData;

function StudentDetailsForm({
  renderButton,
  updateId: studentId,
  defaultData: student,
  hiddenFields = [],
  isLoading,
  updateEnabled,
  formTitle,
}: FormDetailsProps<StudentProfileViewModel, FormData>) {
  const schema = updateEnabled ? studentUpdateSchema : studentCreateSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isNotEmpty(student)
      ? getStudentDefaultUpdateFormData(student)
      : getStudentDefaultCreateFormData(),
  });

  const reset = form.reset;
  const errors = form.formState.errors;

  // invoice download ref
  const paymentOnEnrollRef = useRef<PaymentOnEnrollRefType>(null);

  // updating student's default field value
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isNotEmpty(student)) {
      reset(getStudentDefaultUpdateFormData(student));
    }
  }, [student, reset]);

  // mutations
  const updateMutation = useMutation({
    mutationFn: async (data: IStudentUpdateFormData) => {
      return await updateStudent(data, studentId);
    },
    onSettled: (res) => {
      if (res?.success)
        queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: IStudentCreateFormData) => {
      return await createStudent(data);
    },
    onSettled: (res) => {
      if (res?.success)
        queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  // hidden fields not allowed for create form
  if (!updateEnabled) hiddenFields = [];

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(data as IStudentCreateFormData);
      if (res?.success) {
        const { student, payment } = res.data as {
          student: StudentDTO;
          payment: { id: number; payment_status: string };
        };

        // console.log(res.data);

        // for initial payment, the invoice will be downloaded automatically
        if (payment && payment.payment_status === "PAID") {
          paymentOnEnrollRef.current?.downloadInvoice({
            cohort: student.cohort.name,
            grade: student.grade.name,
            mobile: student.user.phone,
            name: student.full_name,
            section: student.section.name,
            studentId: student.student_id,
            paymentId: payment.id.toString(),
          });
        }
      }
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(studentId) || isEmpty(student)))
    return noRecordFoundFallback();

  const isSubmitable =
    form.formState.isDirty &&
    !form.formState.isLoading &&
    !form.formState.isSubmitting &&
    !form.formState.isValidating;

  return (
    <div>
      <FormProvider {...form}>
        {/* Form Title section */}
        <div>
          <h1 className="text-2xl mb-10 ">
            {formTitle || "Student Details Form"}
          </h1>
        </div>

        {/* Error Area */}
        {isNotEmpty(errors) && (
          <div className="p-4 rounded-md bg-red-100 mb-6 text-red-500">
            {showErrors(errors as { [key: string]: { message: string } })}
          </div>
        )}

        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="personal-details space-y-8 ">
              <div className="space-y-4 p-4 pb-8 rounded-md border shadow-md ">
                <h3 className="text-lg mb-4">Student Personal Details</h3>
                <InputField
                  label="Student name"
                  {...form.register("full_name")}
                  error={errors.full_name}
                />
                <InputField
                  label="Father's name"
                  {...form.register("father_name")}
                  error={errors.father_name}
                />
                <InputField
                  label="Mother's Name"
                  {...form.register("mother_name")}
                  error={errors.mother_name}
                />
                <InputField
                  label="Phone (optional)"
                  {...form.register("user.phone")}
                  error={errors.user?.phone}
                />
                <InputField
                  label="Guardian Phone (optional)"
                  {...form.register("guardian_phone")}
                  error={errors.guardian_phone}
                />
                <SelectGenderField />
                <StudentDateOfBirthField />
              </div>

              <AddressFields />
            </div>
            <div className=" flex flex-col gap-8">
              <div className="space-y-4 p-4 pb-8 rounded-md border shadow-md">
                <h3 className="text-lg mb-4">Student Academic Details</h3>

                <SelectGradeField />

                <SelectSectionField />
                <SelectCohortField />
                <StudentRollField />
                <InputField
                  label="Student ID"
                  {...form.register("student_id")}
                  error={errors.student_id}
                />
              </div>

              {/* {!updateEnabled && (
                <FormSection title="Payment">
                  <p className="text-red-500 flex items-start">
                    <AlertCircleIcon className="w-5 h-5 inline-block mr-2 mt-[2px]" />
                    Please double-check your information before submitting to
                    ensure accurate processing.
                  </p>
                  <PaymentOnEnroll ref={paymentOnEnrollRef} />
                </FormSection>
              )} */}

              {!hiddenFields.includes("user") && (
                <UserFields update={!!studentId} hiddenFields={hiddenFields} />
              )}

              {renderButton ? (
                renderButton(form.formState.isSubmitting)
              ) : (
                <Button
                  type="submit"
                  className="mt-auto bg-green-500"
                  disabled={!isSubmitable}
                  isLoading={form.formState.isSubmitting}
                >
                  Submit Student Info
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default StudentDetailsForm;
