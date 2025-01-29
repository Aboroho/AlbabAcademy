import NoticeList from "@/app/(landing-page)/notice/[category]/NoticeList";
import React from "react";

type Props = {};

function NoticeSection({}: Props) {
  return (
    <div className="container p-10 flex gap-4 flex-col lg:flex-row">
      <div className="p-4 lg:px-10 max-h-[500px] min-h-[200px] overflow-y-scroll border pt-10 flex-1 rounded-md">
        <div className="text-2xl text-center mb-5">General Notice</div>
        <NoticeList category="GENERAL" page={1} pageSize={20} />
      </div>
      <div className="p-4 lg:px-10 max-h-[500px] min-h-[200px] overflow-y-scroll border pt-10 flex-1 rounded-md">
        <div className="text-2xl text-center mb-5">Announcement</div>
        <NoticeList category="ANNOUNCEMENT" page={1} pageSize={1} />
      </div>
    </div>
  );
}

export default NoticeSection;
