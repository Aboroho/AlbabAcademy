import { Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  message: string;
  image: string;
  name: string;
  designation: string;
  messageId: number;
};

function MessageCard({ message, image, name, designation, messageId }: Props) {
  const newMessage = message.substring(0, 200);
  return (
    <div
      className="flex gap-6  border-2 border-brand lg:p-10 rounded-md shadow-lg flex-col lg:flex-row p-4"
      style={{
        background: "linear-gradient(115deg, #ffffff, #eeeeee, #ffffff)",
      }}
    >
      <div className="p-2 rounded-full border-primary relative self-center ">
        <div className="absolute w-[128px] h-[128px] rounded-full p-4 bg-brand -z-10 top-[-10px] left-[-30px] opacity-40"></div>
        <div className="w-[128px] h-[128px] rounded-full p-4 bg-primary">
          <Image
            className="w-[100px] h-[100px] rounded-full object-cover border-white border-2"
            width={100}
            height={100}
            src={image}
            alt="avatar"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:pt-10">
        <div className="text-gray-600 flex flex-col gap-2">
          <Quote className="text-primary" />
          <p className="">
            {newMessage}{" "}
            <Link
              className="underline pl-2 text-[#b30938]"
              href={"/message/" + messageId}
            >
              Read more
            </Link>
          </p>
          {/* <Quote className="self-end" /> */}
        </div>
        <div className="">
          <p
            className=" text-xl text-primary"
            style={{
              background: "-webkit-linear-gradient(115deg, #262935, #b30938)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {name}
          </p>
          <p className="text-slate-700 text-sm">{designation}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageCard;
