import Image from "next/image";
import React from "react";

type Props = {};

function Admission({}: Props) {
  return (
    <div className="min-h-[80vh] container">
      <h1 className="text-3xl mt-10 text-center">Admission Details</h1>
      <div className=" flex items-center justify-center p-10 text-center">
        <Image
          alt="admission"
          src={"/assets/images/fees.jpg"}
          width={1920}
          height={1080}
          className="w-[800px] h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Admission;
