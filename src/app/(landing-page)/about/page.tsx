"use client";
import { useGetStaticPageBySlug } from "@/client-actions/queries/static-page-queries";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import React from "react";

type Props = {};

function About({}: Props) {
  const { data: page, isLoading } = useGetStaticPageBySlug("about-us");
  return (
    <div className="container py-10 min-h-[400px]">
      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="w-1/3 h-7" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </div>
      )}
      <h1 className="text-2xl mb-4">{page?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page?.body || "" }}></div>
    </div>
  );
}

export default About;
