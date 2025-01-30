"use client";

import { useGetPublicNotices } from "@/client-actions/queries/notice-queries";
import { Button } from "@/components/button";
import { Accordion } from "@/components/shadcn/ui/accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Bell, ChevronDown, DownloadCloudIcon } from "lucide-react";
import { RiAttachment2 } from "react-icons/ri";

type Props = {
  category: string;
  page?: number;
  pageSize?: number;
};

function NoticeList({ category, page, pageSize }: Props) {
  const { data, isLoading, isError, error } = useGetPublicNotices(
    {},
    {
      notice_category: category.toLocaleUpperCase(),
      ...(page && { page }),
      ...(pageSize && { pageSize }),
    }
  );

  if (isLoading)
    return (
      <div className="flex gap-4 flex-col">
        <Skeleton className="w-full h-[50px]" />
        <Skeleton className="w-full h-[50px]" />
        <Skeleton className="w-full h-[50px]" />
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;

  const notices = data?.notices;
  //   const count = data?.count;

  if (!notices || notices.length === 0)
    return <div className="text-sm text-gray-500">No notices found</div>;

  return (
    <div className="flex flex-col gap-4">
      {notices.map((notice) => (
        <div key={notice.id} className="border rounded-md ">
          <Accordion type="single" collapsible>
            <AccordionItem value={notice.id.toString()}>
              <AccordionTrigger asChild>
                <div className="flex w-full justify-between  p-2 px-4 cursor-pointer text-md bg-gray-100">
                  <h2 className="flex gap-2 items-center font-semibold">
                    <Bell className="w-4" />
                    {notice.title}
                  </h2>
                  <div className="flex gap-4 items-center">
                    <div className="text-[12px] text-gray-700">
                      {formatDate(notice.created_at)}
                    </div>
                    <ChevronDown className="ml-auto w-4" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4  ">
                  <div className="dynamic-html-wrapper">
                    <div
                      dangerouslySetInnerHTML={{ __html: notice.description }}
                    />
                  </div>
                  <div className="border border-dashed p-2 py-4">
                    <h3 className="text-md mb-4 flex gap-1 items-center font-medium">
                      <RiAttachment2 /> Attachments
                    </h3>
                    <div className="flex gap-2">
                      {(!notice.attachments ||
                        JSON.parse(notice.attachments).length == 0) && (
                        <div className="text-sm text-gray-500  px-4">
                          No attachments found
                        </div>
                      )}
                      {notice.attachments &&
                        JSON.parse(notice.attachments).map(
                          (attachment: { name: string; url: string }) => (
                            <a
                              href={attachment.url}
                              target="_blank"
                              key={attachment.name}
                            >
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <DownloadCloudIcon /> {attachment.name}
                              </Button>
                            </a>
                          )
                        )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export default NoticeList;
