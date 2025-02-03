"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { TestimonialFormData, testimonialValidationSchema } from "./schema";
import InputField from "@/components/ui/input-field";
import { ApiResponse, FormDetailsProps } from "@/types/common";
import { Button } from "@/components/button";

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

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Testimonial } from "@prisma/client";
import { api } from "@/client-actions/helper";
import InputTextArea from "@/components/ui/input-textarea";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

type FormData = TestimonialFormData;

function TestimonialDetailsForm({
  renderButton,
  updateId: testimonialId,
  defaultData: testimonial,
  formTitle,
  isLoading,
  updateEnabled,
}: FormDetailsProps<Testimonial, FormData>) {
  const schema = testimonialValidationSchema;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      avatar: "",
      name: "",
      designation: "",
      message: "",
    },
  });

  const reset = form.reset;
  const errors = form.formState.errors;
  const avatar = form.watch("avatar");
  useEffect(() => {
    if (isNotEmpty(testimonial)) {
      reset({ ...testimonial });
    }
  }, [reset, testimonial]);

  // mutations
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api("/testimonial/" + testimonialId, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonial"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api("/testimonial/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonial"] });
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      toast.loading("Updating testimonial...", { id: "testimonial-update" });
      res = await updateMutation.mutateAsync(data);
      toast.dismiss("testimonial-update");
      if (res.success) {
        toast.success("Testimonial updated successfully");
      } else {
        toast.error("Error updating testimonial");
      }
    } else {
      toast.loading("Creating testimonial...", { id: "testimonial-create" });
      res = await createMutation.mutateAsync(data as Testimonial);
      toast.dismiss("testimonial-create");
      if (res.success) {
        toast.success("Testimonial created successfully");
        reset();
      } else {
        toast.error("Error creating testimonial");
      }
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(testimonialId) || isEmpty(testimonial)))
    return noRecordFoundFallback();

  return (
    <div>
      {/* Form Title section */}
      <div>
        <h1 className="text-2xl mb-10 ">
          {formTitle || "Testimonial Details Form"}
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
              <FormSection title="Testimonial Details">
                <div className="w-[128px]">
                  <div className="w-[128px] h-[128px] rounded-full bg-gray-400 overflow-hidden transition-all">
                    <div className="w-full h-full relative group">
                      {avatar && (
                        <Image
                          src={avatar}
                          height={128}
                          width={128}
                          alt="Student Avatar"
                        />
                      )}

                      <CldUploadButton
                        options={{
                          resourceType: "auto",
                          maxFiles: 1,
                        }}
                        signatureEndpoint="/api/v1/cloudinary-signature"
                        uploadPreset="user_avatar"
                        onSuccess={(file) => {
                          if (
                            typeof file.info !== "string" &&
                            file.info?.secure_url
                          ) {
                            form.setValue("avatar", file.info.secure_url);
                          }
                        }}
                        className="text-xs absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 group-hover:transition-opacity"
                      >
                        <Button
                          size={"sm"}
                          className="opacity-0 group-hover:opacity-100 group-hover:transition-opacity"
                        >
                          <UploadCloud className="w-5" />
                          Choose
                        </Button>
                      </CldUploadButton>
                    </div>
                  </div>
                </div>
                <InputField
                  label="Author Name"
                  placeholder="e.g., John Doe"
                  {...form.register("name")}
                  error={errors.name}
                />
                <InputField
                  label="Designation"
                  placeholder="e.g., Principal"
                  {...form.register("designation")}
                  error={errors.designation}
                />
                <InputTextArea
                  label="Message"
                  {...form.register("message")}
                  error={errors.message}
                />
              </FormSection>
              <div className="mt-auto">
                {renderButton ? (
                  renderButton(
                    form.formState.isSubmitting ||
                      updateMutation.isPending ||
                      createMutation.isPending
                  )
                ) : (
                  <Button
                    isLoading={form.formState.isSubmitting}
                    type="submit"
                    className="mt-auto"
                    disabled={
                      form.formState.isSubmitting ||
                      updateMutation.isPending ||
                      createMutation.isPending
                    }
                  >
                    Submit Data
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

export default TestimonialDetailsForm;
