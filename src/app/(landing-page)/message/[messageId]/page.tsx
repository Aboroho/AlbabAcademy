import Image from "next/image";
import React from "react";

type Props = {
  params: Promise<{ messageId: number }>;
};

async function Page({ params }: Props) {
  const messageId = (await params).messageId;
  console.log(messageId);
  return (
    <div className="container min-h-[70vh] py-10">
      <div className="p-2 rounded-full border-primary relative self-center ">
        <div className="absolute w-[128px] h-[128px] rounded-full p-4 bg-brand -z-10 top-[-10px] left-[-30px] opacity-40"></div>
        <div className="w-[128px] h-[128px] rounded-full p-4 bg-primary">
          <Image
            className="w-[100px] h-[100px] rounded-full object-cover border-white border-2"
            width={100}
            height={100}
            src={"/assets/images/director.png"}
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
          Al Mamun
        </p>
        <p className="text-slate-700 text-sm">Assistant Director</p>
      </div>

      <div className="mt-5 text-slate-700 text-lg ">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore magnam
        recusandae quis officiis ad distinctio deleniti similique obcaecati?
        Odio dolore dolores cupiditate deleniti sunt natus corrupti totam
        tenetur amet animi ex incidunt illo optio sapiente vel velit, mollitia
        aspernatur! Amet tempore quasi maxime deleniti iusto reprehenderit
        explicabo ducimus sapiente voluptatem! Lorem ipsum dolor sit amet
        <br></br>
        consectetur adipisicing elit. Est cumque dolore voluptate doloribus
        nulla laborum cum sed maiores saepe beatae, libero impedit, doloremque
        officia aut possimus. Exercitationem, voluptate quaerat fuga laborum
        perspiciatis voluptatem! Quo veniam enim delectus deleniti voluptatum
        neque odio laborum, itaque id aut dolore sint soluta, vero eveniet!
      </div>
    </div>
  );
}

export default Page;
