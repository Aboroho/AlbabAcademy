"use client";
import { useGetMediaByGroup } from "@/client-actions/queries/media-queries";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { VideoIcon } from "lucide-react";
import React from "react";

type Props = {};

function VideoGallary({}: Props) {
  const { data: media, isLoading } = useGetMediaByGroup("video");
  return (
    <div className="bg-gray-100 pb-10">
      <div className="lg:py-10 py-5 pb-10 container">
        <div className="text-center mx-auto lg:w-[60%] lg:py-10 py-5">
          <div className="flex justify-center">
            <VideoIcon className="w-12 h-12 text-brand" />
          </div>
          <h2 className="text-[1.5rem] md:text-[1.7rem] lg:text-[2rem] tracking-wide mb-2">
            Video Gallery
          </h2>
          <p className="text-slate-800 text-sm">
            The Albab Academy aims at offering all our students a broad and
            balanced curriculum that provides rewarding and stimulating
            activities to prepare them for the best social and cultural life.
          </p>
        </div>
        {isLoading && (
          <div className="grid grid-cols-2 mt-10 gap-4 p-10">
            <Skeleton className="h-[250px] flex items-center justify-center">
              <VideoIcon className="w-12 h-12 text-brand" />
            </Skeleton>
            <Skeleton className="h-[250px] flex items-center justify-center">
              <VideoIcon className="w-12 h-12 text-brand" />
            </Skeleton>
            <Skeleton className="h-[250px] flex items-center justify-center">
              <VideoIcon className="w-12 h-12 text-brand" />
            </Skeleton>
            <Skeleton className="h-[250px] flex items-center justify-center">
              <VideoIcon className="w-12 h-12 text-brand" />
            </Skeleton>
          </div>
        )}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          {media?.map((file) => (
            <div className=" overflow-hidden" key={file.asset_id}>
              <video src={file.url} controls className="aspect-video"></video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoGallary;
