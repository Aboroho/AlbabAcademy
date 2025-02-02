import NoticeList from "@/app/(landing-page)/notice/[category]/NoticeList";
import { Bell } from "lucide-react";
import React from "react";

type Props = {};

function NoticeSection({}: Props) {
  return (
    <div className="container">
      <div className="text-center mx-auto lg:w-[60%] pt-10">
        <div className="flex justify-center">
          <Bell className="w-12 h-12 text-brand" />
        </div>
        <h2 className="text-[1.5rem] md:text-[1.7rem] lg:text-[2rem] tracking-wide mb-2">
          Notices
        </h2>
        <p className="text-slate-500 text-sm">
          The Albab Academy aims at offering all our students a broad and
          balanced curriculum that provides rewarding and stimulating activities
          to prepare them for the best social and cultural life.
        </p>
      </div>
      <div className="container p-10 flex gap-4 flex-col lg:flex-row">
        <div className="p-4 lg:px-10 max-h-[500px] min-h-[200px] overflow-y-scroll border pt-10 flex-1 rounded-md">
          <div className="text-2xl text-center mb-5">General Notice</div>
          <NoticeList category="GENERAL" page={1} pageSize={20} />
        </div>
        <div className="p-4 lg:px-10 max-h-[500px] min-h-[200px] overflow-y-scroll border pt-10 flex-1 rounded-md">
          <div className="text-2xl text-center mb-5">Announcement</div>
          <NoticeList category="ANNOUNCEMENT" page={1} pageSize={1} />
        </div>
      </div>{" "}
    </div>
  );
}

export default NoticeSection;
