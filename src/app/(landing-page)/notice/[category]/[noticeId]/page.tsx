import React from "react";

type Props = {
  params: Promise<{ noticeId: string }>;
};

async function SingleNoticePage({ params }: Props) {
  const noticeId = (await params).noticeId;
  return (
    <div className="container min-h-[400px] py-10">
      <h1 className="text-2xl">{noticeId}</h1>
      <div>Comming soon..</div>
    </div>
  );
}

export default SingleNoticePage;
