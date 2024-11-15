import Image from "next/image";
import React from "react";

type Props = {};

function Loader({}: Props) {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Image
        alt="loader"
        className="w-[80px]  animate-pulse"
        width={80}
        height={80}
        src={"/assets/images/logo_abstract.png"}
      />
    </div>
  );
}

export default Loader;
