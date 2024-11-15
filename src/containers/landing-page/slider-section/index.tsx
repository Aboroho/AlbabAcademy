"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Math from "@/assets/images/math.jpg";
import Quran from "@/assets/images/quran.jpg";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/button";
import Link from "next/link";
import { School } from "lucide-react";

export default function TopCarousel() {
  return (
    <div className="w-full  ">
      <Carousel
        className=" h-full mx-auto relative overflow-visible"
        plugins={[Autoplay({ delay: 3000, stopOnFocusIn: true })]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className=" max-h-[85vh] ">
          <CarouselItem>
            <div className="relative h-full">
              <div className="overlay absolute top-0 right-0 left-0 bottom-0 bg-black/25"></div>
              <div className="extra-content  absolute top-[100px] lg:left-[200px] right-0 bottom-0 pb-4 text-white justify-center lg:justify-start  flex gap-5  items-end lg:pb-5">
                <div className="text-center lg:text-left lg:mb-10  w-[75%] lg:w-[500px] bg-white text-primary p-5 rounded-md    mt-auto">
                  <h2 className="text-sx font-semi-bold uppercas  ">
                    Learning Begins With Us
                  </h2>
                  <h2 className="t-h1 text-[1.8rem] lg:text-[2rem] font-bold">
                    What We Offer?
                  </h2>
                  <p className="">
                    Albab Academy is dedicated to nurturing the next generation
                    of leaders through a holistic approach to Islamic education.
                  </p>

                  <div className="mt-4 flex  lg:flex-row gap-4 justify-center lg:justify-start ">
                    <Link href="/contact">
                      <Button className=" max-w-fit">
                        <School className="w-4 h-4" /> Know About Us
                      </Button>
                    </Link>
                    <Link href="/admission">
                      <Button className=" max-w-fit">Admission</Button>
                    </Link>
                  </div>
                </div>
              </div>
              <Image
                src={Math}
                alt="header-image"
                className="w-full object-cover"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative h-full">
              <div className="overlay absolute top-0 right-0 left-0 bottom-0 bg-black/25"></div>
              <div className="extra-content  absolute top-0 left-[200px] right-0 bottom-0 text-white  hidden lg:flex gap-5  items-end pb-5">
                <div className="text-center lg:text-left mb-10 lg:mb-0 w-[500px] bg-white text-primary p-5 rounded-md ">
                  <h2 className="text-sx font-semi-bold uppercas  ">
                    Learning Begins With Us
                  </h2>
                  <h2 className="t-h1 text-[1.8rem] lg:text-[2rem] font-bold">
                    What We Offer?
                  </h2>
                  <p className="">
                    Albab Academy is dedicated to nurturing the next generation
                    of leaders through a holistic approach to Islamic education.
                  </p>

                  <div className="mt-4 flex flex-col lg:flex-row gap-4 ">
                    <Link href="/contact">
                      <Button className=" max-w-fit">
                        <School className="w-4 h-4" /> Know About Us
                      </Button>
                    </Link>
                    <Link href="/admission">
                      <Button className=" max-w-fit">Admission</Button>
                    </Link>
                  </div>
                </div>
              </div>
              <Image
                src={Quran}
                alt="header-image"
                className="w-full object-cover h-full"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="">
              <Image
                src={Math}
                alt="header-image"
                className="w-full object-cover"
              />
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="absolute top-1/2 left-[60px] md:left-[100px]">
          <CarouselPrevious />
        </div>
        <div className="absolute top-1/2 right-[60px] md:right-[100px]">
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}
