import { prismaQ } from "@/app/api/utils/prisma";
import Image from "next/image";

import React from "react";

type Props = {
  params: Promise<{ messageId: number }>;
};

async function Page({ params }: Props) {
  const messageId = Number((await params).messageId);
  const testimonial = await prismaQ.testimonial.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!testimonial) return <div>Testimonial not found</div>;
  return (
    <div className="container min-h-[70vh] py-10">
      <div className="p-2 rounded-full border-primary relative self-center ">
        <div className="absolute w-[128px] h-[128px] rounded-full p-4 bg-brand -z-10 top-[-10px] left-[-30px] opacity-40"></div>
        <div className="w-[128px] h-[128px] rounded-full p-4 bg-primary">
          <Image
            className="w-[100px] h-[100px] rounded-full object-cover border-white border-2"
            width={100}
            height={100}
            src={testimonial.avatar}
            alt="avatar"
          />
        </div>
      </div>
      <div className="mt-5">
        <p
          className=" text-xl text-primary"
          style={{
            background: "-webkit-linear-gradient(115deg, #262935, #b30938)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {testimonial.name}
        </p>
        <p className="text-slate-700 text-sm">{testimonial.designation}</p>
      </div>

      <div className="mt-5 text-slate-700 text-lg ">
        <p>{testimonial.message}</p>
      </div>
    </div>
  );
}

export default Page;
