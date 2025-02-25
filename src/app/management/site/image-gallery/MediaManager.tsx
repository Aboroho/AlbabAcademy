"use client";

import { api } from "@/client-actions/helper";
import { useGetMediaByGroup } from "@/client-actions/queries/media-queries";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import { Media } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ImageIcon, ImagesIcon, Trash2, UploadCloud } from "lucide-react";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

type Props = {
  groupName?: string;
  pageTitle?: string;
};

function MediaManager({ groupName, pageTitle }: Props) {
  const group = groupName || "image-gallery";
  const title = pageTitle || "Image Gallery";
  const { data: media, isLoading } = useGetMediaByGroup(group);
  const queryClient = useQueryClient();

  async function handleMediaUpload(cref: CloudinaryUploadWidgetResults) {
    if (cref.event !== "success") return;
    if (!cref.info || typeof cref.info !== "object") return;

    console.log("m", cref.info);

    const data = {
      group: group,
      media: [
        {
          url: cref.info.secure_url,
          asset_id: cref.info.asset_id,
        },
      ],
    };

    try {
      toast.loading("Uploading...", { id: "uploading-media" });
      const res = await api("/media", {
        body: JSON.stringify(data),
        method: "POST",
      });

      if (res.success) {
        toast.success("Uploaded");

        queryClient.setQueryData(["media", group], (prevData: Media[]) => {
          return [...data.media, ...prevData];
        });
      } else {
        toast.error(res.errorDetails as string);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      toast.dismiss("uploading-media");
    }
  }

  async function handleDeleteMedia(assetId: string) {
    try {
      toast.loading("Deleting...", { id: "delete-media" });
      const res = await api("/media/asset_id/" + assetId, {
        method: "delete",
      });

      if (res.success) {
        toast.success("Deleted successfully");
        queryClient.setQueryData(["media", group], (prevData: Media[]) => {
          return prevData.filter((file) => file.asset_id !== assetId);
        });
      } else {
        toast.error(res.errorDetails as string);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      toast.dismiss("delete-media");
    }
  }
  return (
    <div>
      <div className="mb-10 flex gap-2 items-center lg:ml-10 p-2">
        <ImageIcon />
        <h1 className="text-2xl">{title}</h1>
      </div>
      <div className="p-7 border border-dashed border-gray-300 lg:ml-10 lg:mr-10">
        <CldUploadButton
          options={{
            resourceType: "auto",
            maxFiles: 20,
            multiple: true,
          }}
          signatureEndpoint="/api/v1/cloudinary-signature"
          uploadPreset="default_media"
          onSuccess={(file) => {
            console.log(file);
            if (typeof file.info !== "string" && file.info?.secure_url) {
              handleMediaUpload(file);
            }
          }}

          // className="text-xs absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 group-hover:transition-opacity"
        >
          <Button className="bg-green-600 hover:bg-green-700">
            <UploadCloud className="w-5" />
            Choose Media to Upload
          </Button>
        </CldUploadButton>
      </div>

      {isLoading && (
        <div className="grid grid-cols-4 mt-10 gap-4 p-10">
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 p-10 gap-2 mt-10">
        {media?.map((file) => (
          <div className="relative group" key={file.asset_id}>
            {file.group === "video" ? (
              <video controls src={file.url}></video>
            ) : (
              <Image
                src={file.url}
                alt="image"
                width={300}
                height={200}
                className="w-full h-full object-fit aspect-square"
              />
            )}
            <div className="absolute top-0 left-0 ">
              <AlertDialog
                confirmText="Delete"
                title="Delete media"
                onConfirm={() => {
                  handleDeleteMedia(file.asset_id);
                }}
              >
                <Button
                  size={"sm"}
                  className="opacity-0 group-hover:opacity-100 group-hover:transition-opacity bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-5" />
                  Delete
                </Button>
              </AlertDialog>
            </div>
            {/* <div className="absolute top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/15">
              <AlertDialog
                confirmText="Delete"
                title="Delete media"
                onConfirm={() => {
                  handleDeleteMedia(file.asset_id);
                }}
              >
                <Button
                  size={"sm"}
                  className="opacity-0 group-hover:opacity-100 group-hover:transition-opacity bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-5" />
                  Delete
                </Button>
              </AlertDialog>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaManager;
