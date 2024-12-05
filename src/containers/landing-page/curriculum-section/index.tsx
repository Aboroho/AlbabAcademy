import React from "react";
import CurriculumCard from "./card";
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/button";
import Image, { StaticImageData } from "next/image";

import Hafiz from "@/assets/images/hafiz.png";
import Bukhari from "@/assets/images/bukhari.png";
import Humanities from "@/assets/images/humanities.jpg";
import Science from "@/assets/images/Science.jpg";
import Math from "@/assets/images/math.jpg";
import Language from "@/assets/images/Language.jpg";

function CurriculumSection() {
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
        <div className="mt-10 flex gap-4 flex-wrap justify-between lg:w-[75%] mx-auto">
          <CurriculumCard
            title="Hafezi Quran"
            buttonElem={renderViewMoreButton("")}
            description="Guiding students to memorize the entire Quran with devotion and discipline."
            image={renderCardImage(Hafiz)}
          />
          <CurriculumCard
            title="Hadith"
            description="Teaching the sayings and actions of the Prophet (PBUH) to inspire daily living."
            buttonElem={renderViewMoreButton("")}
            image={renderCardImage(Bukhari)}
          />
          <CurriculumCard
            title="Humanities"
            image={renderCardImage(Humanities)}
            buttonElem={renderViewMoreButton("")}
            description="The study of ancient and modern languages, philosophy, history, and more."
          />
          <CurriculumCard
            title="Science"
            image={renderCardImage(Science)}
            buttonElem={renderViewMoreButton("")}
            description="The study of ancient and modern languages, philosophy, history, and more."
          />
          <CurriculumCard
            title="Math"
            image={renderCardImage(Math)}
            buttonElem={renderViewMoreButton("")}
            description="The study of ancient and modern languages, philosophy, history, and more."
          />
          <CurriculumCard
            title="Language"
            image={renderCardImage(Language)}
            buttonElem={renderViewMoreButton("")}
            description="The study of ancient and modern languages, philosophy, history, and more."
          />
        </div>
      </div>
    </section>
  );
}

export default CurriculumSection;
