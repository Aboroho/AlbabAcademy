"use client";

import { api } from "@/client-actions/helper";
import { useGetStaticPageBySlug } from "@/client-actions/queries/static-page-queries";
import { Button } from "@/components/button";
import { FormSection } from "@/components/forms/form-utils";
import InputField from "@/components/ui/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { z } from "zod";

export const staticPageValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof staticPageValidationSchema>;
type Props = {};

function ManageAboutUs({}: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(staticPageValidationSchema),
    defaultValues: {
      body: "",
      slug: "about-us",
      title: "",
    },
  });
  const { data: page, isLoading } = useGetStaticPageBySlug("about-us");
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!page) return;
    form.reset({
      body: page.body,
      title: page.title,
      slug: page.slug,
    });
  }, [form, page]);

  useEffect(() => {
    if (isLoading) toast.loading("Loading page...", { id: "loading-page" });
    else toast.dismiss("loading-page");
  }, [isLoading]);

  async function handleSubmit(data: FormData) {
    toast.loading("Updating page...", { id: "updating-page" });
    const res = await api("/static-page/" + data.slug, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (res.success) {
      toast.success("Page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["static-page", "about-us"] });
      queryClient.setQueryData(["static-page", "about-us"], res.data);
    } else {
      toast.error(res.errorDetails as string);
    }
    toast.dismiss("updating-page");
  }
  return (
    <div>
      <FormSection title="Details">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <InputField {...form.register("title")} label="Page Title" />
          <div className="w-full h-full mt-7">
            <Editor
              apiKey="aqk6likj1ibk3dqnby2fe1h0l9yr2c2rxn1i05bvmdqwd8v2"
              initialValue={form.getValues("body")}
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
                form.setValue("body", editor.getContent());
              }}
            />
          </div>
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 mt-2"
          >
            Submit
          </Button>
        </form>
      </FormSection>
    </div>
  );
}

export default ManageAboutUs;
