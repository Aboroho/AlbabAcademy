"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CurriculumFormData, curriculumValidationSchema } from "./schema";
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

import { api } from "@/client-actions/helper";
import InputTextArea from "@/components/ui/input-textarea";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { Curriculum } from "@prisma/client";

type FormData = CurriculumFormData;

function CurriculumDetailsForm({
  renderButton,
  updateId: curriculumId,
  defaultData: curriculum,
  formTitle,
  isLoading,
  updateEnabled,
}: FormDetailsProps<Curriculum, FormData>) {
  console.log(curriculumId, curriculum);
  const schema = curriculumValidationSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      description: "",
      title: "",
      image: "",
    },
  });

  const reset = form.reset;
  const errors = form.formState.errors;
  const image = form.watch("image");
  useEffect(() => {
    if (isNotEmpty(curriculum)) {
      reset({ ...curriculum });
    }
  }, [reset, curriculum]);

  // mutations
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api("/curriculum/" + curriculumId, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api("/curriculum/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      toast.loading("Updating curriculum...", { id: "curriculum-update" });
      res = await updateMutation.mutateAsync(data);
      toast.dismiss("curriculum-update");
      if (res.success) {
        toast.success("curriculum updated successfully");
      } else {
        toast.error("Error updating curriculum");
      }
    } else {
      toast.loading("Creating curriculum...", { id: "curriculum-create" });
      res = await createMutation.mutateAsync(data as Curriculum);
      toast.dismiss("curriculum-create");
      if (res.success) {
        toast.success("curriculum created successfully");
        reset();
      } else {
        toast.error("Error creating curriculum");
      }
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  if (isLoading) return renderFormSkeleton();
  if (updateEnabled && (isEmpty(curriculumId) || isEmpty(curriculum)))
    return noRecordFoundFallback();

  return (
    <div>
      {/* Form Title section */}
      <div>
        <h1 className="text-2xl mb-10 ">
          {formTitle || "Curriculum Details Form"}
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
              <FormSection title="curriculum Details">
                <div className="w-[428px]">
                  <div className="w-[428px] h-[428px]  bg-gray-400 overflow-hidden transition-all">
                    <div className="w-full h-full relative group">
                      {image && (
                        <Image
                          src={image}
                          height={428}
                          width={428}
                          className="w-full h-full object-cover"
                          alt="Student Avatar"
                        />
                      )}

                      <CldUploadButton
                        options={{
                          resourceType: "auto",
                          maxFiles: 1,
                        }}
                        signatureEndpoint="/api/v1/cloudinary-signature"
                        uploadPreset="default_media"
                        onSuccess={(file) => {
                          if (
                            typeof file.info !== "string" &&
                            file.info?.secure_url
                          ) {
                            form.setValue("image", file.info.secure_url);
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
                  label="Title"
                  placeholder="e.g. Math"
                  {...form.register("title")}
                  error={errors.title}
                />

                <InputTextArea
                  label="Description"
                  {...form.register("description")}
                  rows={8}
                  error={errors.description}
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

export default CurriculumDetailsForm;
