import React from "react";

type Props = {
  params: Promise<{ title: string }>;
};

async function Regulation({ params }: Props) {
  const title = (await params).title;
  return (
    <div className="container min-h-[400px] py-10">
      <h1 className="text-2xl">{title.replaceAll("-", " ")}</h1>
      <div>comming soon...</div>
    </div>
  );
}

export default Regulation;
