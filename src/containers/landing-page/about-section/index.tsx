"use client";

import StudentReading from "@/assets/images/children-reading.jpg";
import StudentReading2 from "@/assets/images/student-reading.webp";
import { Button } from "@/components/button";
import Image from "next/image";
import LogoAbstract from "@/assets/images/logo_abstract.png";

import Blob1 from "@/assets/images/blob-1.svg";
import Blob2 from "@/assets/images/blob-1.svg";
function AboutSection() {
  return (
    <div className="py-[5rem] relative bg-accent">
      <Blob1 className="w-[500px] h-[500px]  fill-brand/30 absolute -left-[250px] top-[270px] lg:top-0  opacity-60 -z-100" />
      <Blob2 className="w-[500px] h-[500px]   fill-red-100  absolute -bottom-[100px] -right-[200px] -z-100" />
      {/* <Image
        src={Blob1}
        alt="blob"
        width={500}
        height={500}
        className="w-[500px] h-[500px]  fill-brand/30 absolute -left-[250px] top-[270px] lg:top-0  opacity-60 -z-100"
      />
      <Image
        src="/assets/images/blob-1.svg"
        alt="blob"
        width={500}
        height={500}
        className="w-[500px] h-[500px]   fill-red-100  absolute -bottom-[100px] -right-[200px] -z-100"
      /> */}

      <div className="container text-center relative z-10">
        <div className="flex items-center flex-col gap-2 ">
          <div className="w-[74px] h-[74px] bg-primary flex items-center justify-center rounded-full">
            <Image
              src={LogoAbstract}
              alt="albab academy logo"
              height={64}
              width={64}
            />
          </div>
          <h2 className="text-[2rem] mb-[5rem]">Learning Begins With Us</h2>
        </div>

        <div className="space-y-20">
          <div className="flex flex-col lg:flex-row hover:scale-110 transition-transform duration-200">
            <div className="text-left p-4 lg:p-8 lg:px-16  lg:w-[60%] order-2 lg:order-1">
              <p className="text-slate-700 text-left leading-8 ">
                Albab Academy is dedicated to nurturing the next generation of
                leaders through a holistic approach to Islamic education. We
                blend traditional Islamic teachings with modern academic
                disciplines, ensuring students develop both spiritually and
                intellectually. Our mission is to empower learners to excel in
                their faith, character, and worldly knowledge, preparing them
                for a life of success and service to humanity.
              </p>
              <Button className="mt-4">Join our mission</Button>
            </div>
            <div className="lg:max-h-[250px] md:w-1/2 lg:w-[40%] order-1">
              <Image
                src={StudentReading}
                alt="image of student-reading"
                className="w-full max-h-full object-cover rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row hover:scale-110 transition-transform duration-200">
            <div className="lg:max-h-[250px] md:w-1/2 lg:w-[40%] ">
              <Image
                src={StudentReading2}
                alt="student-reading image"
                className="w-full max-h-full object-cover rounded-md"
              />
            </div>
            <div className=" text-center  p-4 lg:p-8 lg:px-16 lg:w-[60%] ">
              <p className="text-slate-700 text-left leading-8 ">
                At Albab Academy, we believe in the importance of fostering a
                deep connection with Islamic values while equipping students
                with the critical thinking skills required in today’s fast-paced
                world. Our diverse programs cater to students of all ages,
                ensuring that everyone can find a path toward spiritual
                enlightenment and personal growth.
              </p>
              {/* <Button className="mt-4 bg-brand">Contact us</Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
