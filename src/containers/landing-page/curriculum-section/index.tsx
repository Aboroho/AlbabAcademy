"use client";
import CurriculumCard from "./card";
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/button";
import Image, { StaticImageData } from "next/image";

import { useGetAllCurriculums } from "@/client-actions/queries/curriculum-queries";
import { Skeleton } from "@/components/shadcn/ui/skeleton";

function CurriculumSection() {
  const { data: curriculums, isLoading } = useGetAllCurriculums();
  function renderViewMoreButton(url: string) {
    return (
      <Link
        href={url}
        className={cn(
          buttonVariants({ variant: "link", size: "link" }),
          "border border-primary !rounded-lg !text-sm !py-1"
        )}
      >
        <ExternalLink className="w-4 h-4" />
        Read More
      </Link>
    );
  }

  function renderCardImage(src: StaticImageData | string) {
    return (
      <Image
        src={src}
        height={300}
        width={300}
        alt="Hafiz image"
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <section>
      <div className="py-[5rem] container" id="curriculum">
        <div className="text-center mx-auto lg:w-[60%]">
          <div className="flex justify-center">
            <BookOpen className="w-12 h-12 text-brand" />
          </div>
          <h2 className="text-[1.5rem] md:text-[1.7rem] lg:text-[2rem] tracking-wide mb-2">
            Curriculum Overview
          </h2>
          <p className="text-slate-500 text-sm">
            The Albab Academy aims at offering all our students a broad and
            balanced curriculum that provides rewarding and stimulating
            activities to prepare them for the best social and cultural life.
          </p>
        </div>
        {isLoading && (
          <div className="mt-10 flex gap-4 flex-wrap justify-between lg:w-[75%] mx-auto">
            {Array.from({ length: 6 }).map((_, index) => {
              return (
                <CurriculumCard
                  key={index}
                  title={<Skeleton className="h-5 w-1/2 mb-2" />}
                  description={
                    <div>
                      <Skeleton className="h-3 mb-2 w-full" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  }
                  image={<Skeleton className="h-[300px] w-[300px]" />}
                  buttonElem={<Skeleton className="h-5 w-1/3" />}
                />
              );
            })}
          </div>
        )}

        <div className="mt-10 flex gap-4 flex-wrap justify-between lg:w-[75%] mx-auto">
          {curriculums?.map((curriculum) => (
            <CurriculumCard
              key={curriculum.id}
              title={curriculum.title}
              description={curriculum.description}
              image={renderCardImage(curriculum.image)}
              buttonElem={renderViewMoreButton("/" + curriculum.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CurriculumSection;
