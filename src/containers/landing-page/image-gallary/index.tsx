"use client";
import { useGetMediaByGroup } from "@/client-actions/queries/media-queries";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { ImagesIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

function ImageGallary({}: Props) {
  const { data: media, isLoading } = useGetMediaByGroup("image-gallery");
  return (
    <div className="container py-10 ">
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
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
          <Skeleton className="h-[250px] flex items-center justify-center">
            <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
          </Skeleton>
        </div>
      )}
      <div className="grid gap-2 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        {media?.map((file) => (
          <div className=" overflow-hidden" key={file.asset_id}>
            <Image
              src={file.url}
              alt="image"
              height={300}
              width={300}
              className="w-full object-cover h-[300px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallary;
