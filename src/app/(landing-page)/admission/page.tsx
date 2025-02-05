"use client";
import { useGetMediaByGroup } from "@/client-actions/queries/media-queries";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { ImagesIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

function Admission({}: Props) {
  const { data: media, isLoading } = useGetMediaByGroup("admission-details");
  return (
    <div className="min-h-[80vh] container">
      <h1 className="text-3xl mt-10 text-center">Admission Details</h1>
      <div className=" flex items-center justify-center p-10 text-center">
        {media && media?.length > 0 && (
          <Image
            alt="admission"
            src={media[0].url}
            width={1920}
            height={1080}
            className="w-[800px] h-full object-cover"
          />
        )}
      </div>

      {isLoading && (
        <Skeleton className="h-[550px] flex items-center justify-center">
          <ImagesIcon className="text-gray-500 w-[30px] h-[30px]" />
        </Skeleton>
      )}
    </div>
  );
}

export default Admission;
