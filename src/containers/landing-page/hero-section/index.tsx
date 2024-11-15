import { Button } from "@/components/button";
import React from "react";
import HeroVideo from "./video";
import Link from "next/link";
import { PhoneOutgoing } from "lucide-react";

function HeroSection() {
  return (
    <div className="w-full  bg-accent bg-gradient-to-b lg:bg-gradient-to-r from-white  to-brand/15 -z-20 border-b border-brand/50">
      <div className=" hero-pattern relative ">
        <div className="relative z-20">
          <div className=" container h-[768px] flex flex-col py-10 lg:flex-row lg:py-0 items-center justify-between ">
            <div className="text-center lg:text-left mb-10 lg:mb-0 w-full lg:w-[50%] lg:pr-6">
              <h2 className="text-sx font-semi-bold uppercase">
                Learning Begins With Us
              </h2>
              <h1 className="t-h1 text-[2.5rem] lg:text-[3rem] text-brand font-bold">
                Albab Academy
              </h1>
              <p className="text-slate-600">
                Albab Academy is dedicated to nurturing the next generation of
                leaders through a holistic approach to Islamic education. We
                blend traditional Islamic teachings with modern academic
                disciplines, ensuring students develop both spiritually and
                intellectually.
              </p>
              <div className="mt-4 flex flex-col lg:flex-row gap-4 ">
                <div>
                  <Button className="max-w-fit">Explore our curriculum</Button>
                </div>
                <Link href="/contact">
                  <Button className="bg-brand/80 hover:bg-brand/90 max-w-fit">
                    <PhoneOutgoing className="w-4 h-4" /> Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-[50%] relative">
              <div className="absolute -top-[400px] w-full"></div>
              <div className="aspect-video  rounded-md border-brand border-2 relative hover:scale-[1.05] duration-300 transition-transform">
                <HeroVideo />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
