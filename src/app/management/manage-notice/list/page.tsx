"use client";

import { NoticeListDTO } from "@/app/api/services/types/dto.types";
import { api } from "@/client-actions/helper";
import { useGetPrivateNotices } from "@/client-actions/queries/notice-queries";
import { Protected } from "@/components/auth";
import { Button } from "@/components/button";
import { Accordion } from "@/components/shadcn/ui/accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import { Badge } from "@/components/shadcn/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import { DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, ChevronDown, DownloadCloudIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { RiAttachment2 } from "react-icons/ri";

function NoticeList() {
  const { data, isLoading, isError, error, key } = useGetPrivateNotices(
    {}
    // { notice_category: category.toLocaleUpperCase() }
  );

  const notices = data?.notices;
  //   const count = data?.count;

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api("/notice/" + id, {
        method: "DELETE",
      });
    },

    onSettled: (res) => {
      if (!res?.success) return;
      const data = res.data as { id: number };

      queryClient.invalidateQueries({ queryKey: ["notices", "private"] });
      queryClient.setQueryData(
        ["notices", "private", key],
        (oldData: NoticeListDTO) => {
          if (oldData && oldData.notices) {
            const newData = oldData.notices.filter(
              (notice) => notice.id !== data.id
            );
            oldData.notices = newData;
            return oldData;
          }
          return oldData;
        }
      );
    },
  });

  async function handleDelete(id: number) {
    toast.loading("Deleting notice...", { id: "delete-notice" });
    try {
      const res = await deleteMutation.mutateAsync(id);
      if (res.success) {
        toast.success("Notice deleted");
      } else {
        toast.error("Failed to delete notice");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Some error occured");
    } finally {
      toast.dismiss("delete-notice");
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
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
                  <h2 className="flex gap-4 items-center font-semibold">
                    <Bell className="w-4" />
                    {notice.title}{" "}
                    <div className="flex wrap gap-2">
                      {" "}
                      <Badge className="bg-orange-600">
                        {notice.notice_type}
                      </Badge>{" "}
                      <Badge>{notice.notice_category}</Badge>{" "}
                      <Badge className="bg-green-500">
                        {notice.notice_target}
                      </Badge>
                    </div>
                  </h2>
                  <div className="ml-auto flex gap-2 items-center">
                    <Popover>
                      <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                        <DotsVerticalIcon className="w-4 h-4 cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent
                        className=" z-[1]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="action-menu-container">
                          <Link
                            href={"/management/manage-notice/" + notice.id}
                            className="flex gap-3  items-center  cursor-pointer hover:text-slate-700"
                          >
                            <Pencil1Icon className="w-5 h-5" />
                            <span>Edit</span>
                          </Link>
                          <Protected action="hide" roles={["ADMIN"]}>
                            <AlertDialog
                              onConfirm={() => handleDelete(notice.id)}
                              confirmText="Delete"
                              message=""
                            >
                              <div
                                className="flex gap-3  cursor-pointer text-red-500 hover:text-red-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-5 h-5" />
                                <span>Delete</span>
                              </div>
                            </AlertDialog>
                          </Protected>
                        </div>
                      </PopoverContent>
                    </Popover>

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
