"use client";

import { ApiResponse, FormDetailsProps } from "@/types/common";
import React, { useEffect } from "react";

import { Editor } from "@tinymce/tinymce-react";

import {
  Controller,
  FieldError,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormSection,
  isNotEmpty,
  renderFormSkeleton,
  resolveFormError,
  showErrors,
} from "../form-utils";
import InputField from "@/components/ui/input-field";

import { Button } from "@/components/button";
import { LayoutTemplate, PlusIcon } from "lucide-react";

import { NoticeResponse } from "@/types/response_types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  NoticeCreateFormData,
  noticeCreateSchema,
  NoticeUpdateFormData,
  noticeUpdateSchema,
} from "./schema";

import { SelectInput } from "@/components/ui/single-select-input";
import { createNotice, updateNotice } from "./utils";
import { Cross1Icon } from "@radix-ui/react-icons";

type FormData = NoticeCreateFormData | NoticeUpdateFormData;
function NoticeForm({
  renderButton,
  defaultData: noticeData,
  updateEnabled,
  updateId: noticeId,
  isLoading,
  formTitle,
}: FormDetailsProps<NoticeResponse, FormData>) {
  const schema = updateEnabled ? noticeUpdateSchema : noticeCreateSchema;

  const form = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      notice_target: "ALL_USERS",
      notice_type: "PUBLIC",
      notice_category: "GENERAL",
      status: "ACTIVE",
      attachments: [],
    },
  });

  const { prepend, fields, remove } = useFieldArray({
    control: form.control,
    name: "attachments",
  });

  function addNewField() {
    prepend({ name: "", url: "" });
  }

  const reset = form.reset;
  const errors = form.formState.errors;

  useEffect(() => {
    if (noticeData && isNotEmpty(noticeData)) {
      reset({
        title: noticeData?.title,
        description: noticeData.description,
        notice_target: noticeData.notice_target,
        notice_type: noticeData.notice_type || "PUBLIC",
      });
    }
  }, [noticeData, reset]);

  // mutation
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data: NoticeUpdateFormData) => {
      return await updateNotice(data, noticeId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notice", noticeId] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: NoticeCreateFormData) => {
      return await createNotice(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    },
  });

  async function onSubmit(data: FormData) {
    let res: ApiResponse | undefined;
    if (updateEnabled) {
      res = await updateMutation.mutateAsync(data);
    } else {
      res = await createMutation.mutateAsync(data as NoticeCreateFormData);
    }

    if (res && !res.success) return resolveFormError<FormData>(res, form);
  }

  console.log(form.watch("description"));

  if (isLoading) return renderFormSkeleton();
  //   if (updateEnabled && (isEmpty(paymentTemplateId) || isEmpty(paymentTemplate)))
  //     return noRecordFoundFallback();

  return (
    <div>
      {/* Form Title section */}
      <div>
        <h1 className="text-2xl mb-10 ">{formTitle || "Notice Form"}</h1>
      </div>
      {/* Error Area */}
      {isNotEmpty(errors) && (
        <div className="p-4 rounded-md bg-red-100 mb-6 text-red-500">
          {showErrors(errors as { [key: string]: { message: string } })}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-5 space-between py-5">
          <div className="w-[40%]">
            <FormSection title="General Info">
              <InputField
                icon={<LayoutTemplate className="w-4 h-4" />}
                placeholder="Title for the notice"
                {...form.register("title")}
                label="Notice Title"
                error={errors.title}
              />
              <Controller
                control={form.control}
                name="notice_target"
                rules={{}}
                render={({ field }) => (
                  <SelectInput
                    selectedValue={field.value}
                    isLoading={isLoading}
                    error={errors.notice_target as FieldError}
                    placeholder="Select Target"
                    onSelect={field.onChange}
                    triggerClassName="w-full"
                    options={[
                      {
                        label: "All Users",
                        value: "ALL_USERS",
                      },
                      {
                        label: "Teacher",
                        value: "TEACHER",
                      },
                      {
                        label: "Student",
                        value: "STUDENT",
                      },
                      {
                        label: "Staff",
                        value: "STAFF",
                      },
                      {
                        label: "Director",
                        value: "DIRECTOR",
                      },
                      {
                        label: "Super Admin",
                        value: "SUPER_ADMIN",
                      },
                    ]}
                    label={"Notice Target"}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="notice_type"
                rules={{}}
                render={({ field }) => (
                  <SelectInput
                    selectedValue={field.value}
                    isLoading={isLoading}
                    error={errors.notice_type as FieldError}
                    placeholder="Select Target"
                    onSelect={field.onChange}
                    triggerClassName="w-full"
                    options={[
                      {
                        label: "Public",
                        value: "PUBLIC",
                      },
                      {
                        label: "Private",
                        value: "PRIVATE",
                      },
                    ]}
                    label={"Notice Visibility"}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="notice_category"
                rules={{}}
                render={({ field }) => (
                  <SelectInput
                    selectedValue={field.value}
                    error={errors.notice_category as FieldError}
                    placeholder="Select Category"
                    onSelect={field.onChange}
                    triggerClassName="w-full"
                    options={[
                      {
                        label: "Recruitment",
                        value: "RECRUITMENT",
                      },
                      {
                        label: "Admission",
                        value: "ADMISSION",
                      },
                      {
                        label: "Announcement",
                        value: "ANNOUNCEMENT",
                      },
                      {
                        label: "Student Notice",
                        value: "STUDENT_NOTICE",
                      },
                      {
                        label: "Teacher Notice",
                        value: "TEACHER_NOTICE",
                      },
                      {
                        label: "General",
                        value: "GENERAL",
                      },
                    ]}
                    label={"Notice Category"}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="status"
                rules={{}}
                render={({ field }) => (
                  <SelectInput
                    selectedValue={field.value}
                    error={errors.notice_type as FieldError}
                    placeholder="Select Status"
                    onSelect={field.onChange}
                    triggerClassName="w-full"
                    options={[
                      {
                        label: "Active",
                        value: "ACTIVE",
                      },
                      {
                        label: "Inactive",
                        value: "INACTIVE",
                      },

                      {
                        label: "Archived",
                        value: "ARCHIVED",
                      },
                    ]}
                    label={"Notice Status"}
                  />
                )}
              />
            </FormSection>
            <br />
            <FormSection title="Attachments">
              <Button
                size="sm"
                onClick={addNewField}
                type="button"
                className="mb-4 bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="w-3 h-3" />
                Add New Attachment
              </Button>

              {fields.map((field, index) => (
                <div
                  className="flex gap-2 flex-nowrap items-start"
                  key={field.id}
                >
                  <InputField
                    label="Attachment Name"
                    placeholder="e.g., Result Sheet"
                    {...form.register(`attachments.${index}.name`)}
                    error={errors.attachments?.[index]?.name}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.setFocus(`attachments.${index}.name`);
                      }
                    }}
                  />
                  <InputField
                    label="Attachment URL"
                    placeholder="e.g., https:///example.com/image.jpg"
                    {...form.register(`attachments.${index}.url`)}
                    error={errors.attachments?.[index]?.url}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.setFocus(`attachments.${index}.name`);
                      }
                    }}
                    rightIcon={
                      <Cross1Icon
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => remove(index)}
                      />
                    }
                  />
                </div>
              ))}
            </FormSection>
          </div>
          <div className=" h-full w-[60%]  ">
            <Editor
              apiKey="aqk6likj1ibk3dqnby2fe1h0l9yr2c2rxn1i05bvmdqwd8v2"
              initialValue={form.getValues("description")}
              init={{
                height: 700,
                menubar: false,
                images_upload_handler: async (blobInfo) => {
                  // Extract the URL from the BlobInfo object
                  const imageUrl = blobInfo.blobUri();
                  return Promise.resolve(imageUrl); // Return a resolved promise with the URL
                },
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "image " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onChange={(content, editor) => {
                form.setValue("description", editor.getContent());
              }}
            />

            {/* <ReactQuill
              theme="snow"
              value={form.watch("description")}
              onChange={(content) => form.setValue("description", content)}
              className="h-[60vh] w-full"
            /> */}
            <div className="mt-[50px]  flex justify-end">
              {renderButton ? (
                renderButton(form.formState.isSubmitting)
              ) : (
                <Button type="submit" className="">
                  Create Notice
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default NoticeForm;
