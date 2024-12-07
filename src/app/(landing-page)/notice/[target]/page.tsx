import React from "react";

type Props = {
  params: Promise<{ target: string }>;
};

async function NoticePage({ params }: Props) {
  const target = (await params).target;
  return (
    <div className="container min-h-[400px] py-10">
      <h1 className="text-2xl">Notice [{target.toUpperCase()}]</h1>
      <div>Comming soon..</div>
    </div>
  );
}

export default NoticePage;
