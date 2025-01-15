import React from "react";
import NoticeList from "./NoticeList";

type Props = {
  params: Promise<{ category: string }>;
};

async function NoticePage({ params }: Props) {
  const category = (await params).category;
  return (
    <div className="container min-h-[400px] py-10">
      <h1 className="text-2xl mb-5">Notice [{category.toUpperCase()}]</h1>
      <NoticeList category={category} />
    </div>
  );
}

export default NoticePage;
