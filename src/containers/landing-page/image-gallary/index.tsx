import Image from "next/image";
import React from "react";

type Props = {};

function ImageGallary({}: Props) {
  return (
    <div className="container py-10 ">
      <div className="grid gap-2 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        <div className=" overflow-hidden">
          <Image
            src="/assets/images/math.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" overflow-hidden ">
          <Image
            src="/assets/images/quran.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" overflow-hidden">
          <Image
            src="/assets/images/school.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" overflow-hidden">
          <Image
            src="/assets/images/math.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" overflow-hidden">
          <Image
            src="/assets/images/math.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" overflow-hidden">
          <Image
            src="/assets/images/math.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" overflow-hidden">
          <Image
            src="/assets/images/math.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" overflow-hidden">
          <Image
            src="/assets/images/math.jpg"
            alt="image"
            height={300}
            width={300}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default ImageGallary;
