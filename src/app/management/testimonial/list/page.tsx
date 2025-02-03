"use client";

import { api } from "@/client-actions/helper";
import { useGetAllTestimonial } from "@/client-actions/queries/testimonial-queries";
import { Protected } from "@/components/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import { Testimonial } from "@prisma/client";
import { DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

type Props = {};

function TestimonialList({}: Props) {
  const { data: testimonials, isLoading } = useGetAllTestimonial();
  const queryClient = useQueryClient();

  async function handleDelete(id: number) {
    toast.loading("Deleting testimonial...", { id: "delete-testimonial" });
    try {
      const res = await api("/testimonial/" + id, {
        method: "DELETE",
      });
      if (res.success) {
        toast.success("Testimonial deleted");
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        queryClient.setQueryData(
          ["testimonial", id],
          (prevData: Testimonial[]) => {
            return prevData?.filter((testimonial) => testimonial.id !== id);
          }
        );
      } else {
        toast.error("Failed to delete testimonial");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Some error occured");
    } finally {
      toast.dismiss("delete-testimonial");
    }
  }
  return (
    <div>
      <div>
        <h1 className="text-xl mb-8">Testimonial List</h1>
        <div className="flex flex-col gap-3">
          {isLoading && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 max-w-[512px] bg-gray-200 px-4 py-2 rounded-md">
                <div className="w-[50px] h-[50px] rounded-full bg-gray-400"></div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-lg">
                    <Skeleton className="w-[150px] h-[10px]" />
                  </p>
                  <p className="text-xs text-gray-500">
                    <Skeleton className="w-[100px] h-[10px]" />
                  </p>
                  <div></div>
                </div>
              </div>
              <div className="flex items-center gap-4 max-w-[512px] bg-gray-200 px-4 py-2 rounded-md">
                <div className="w-[50px] h-[50px] rounded-full bg-gray-400"></div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-lg">
                    <Skeleton className="w-[150px] h-[10px]" />
                  </p>
                  <p className="text-xs text-gray-500">
                    <Skeleton className="w-[100px] h-[10px]" />
                  </p>
                  <div></div>
                </div>
              </div>
              <div className="flex items-center gap-4 max-w-[512px] bg-gray-200 px-4 py-2 rounded-md">
                <div className="w-[50px] h-[50px] rounded-full bg-gray-400"></div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-lg">
                    <Skeleton className="w-[150px] h-[10px]" />
                  </p>
                  <p className="text-xs text-gray-500">
                    <Skeleton className="w-[100px] h-[10px]" />
                  </p>
                  <div></div>
                </div>
              </div>
              <div className="flex items-center gap-4 max-w-[512px] bg-gray-200 px-4 py-2 rounded-md">
                <div className="w-[50px] h-[50px] rounded-full bg-gray-400"></div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-lg">
                    <Skeleton className="w-[150px] h-[10px]" />
                  </p>
                  <p className="text-xs text-gray-500">
                    <Skeleton className="w-[100px] h-[10px]" />
                  </p>
                  <div></div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && testimonials?.length === 0 && (
            <div className="flex flex-col gap-4 max-w-[512px]">
              <p className="text-center text-gray-500">No testimonials</p>
            </div>
          )}
          {testimonials?.map((testimonial) => (
            <div
              className="flex items-center gap-4 max-w-[512px] bg-gray-200 px-4 py-2 rounded-md"
              key={testimonial.id}
            >
              <div className="w-[50px] h-[50px] rounded-full bg-gray-400">
                <Image
                  src={testimonial.avatar}
                  width={100}
                  height={100}
                  className="rounded-full max-w-full max-h-full object-cover"
                  alt="avatar"
                />
              </div>
              <div>
                <p className="font-medium text-lg">{testimonial.name}</p>
                <p className="text-xs text-gray-500">
                  {testimonial.designation}
                </p>
                <div></div>
              </div>
              <div className="ml-auto flex gap-2 items-center ">
                <Popover>
                  <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                    <DotsVerticalIcon className="w-4 h-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[150px] z-[1]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="action-menu-container">
                      <Link
                        href={"/management/testimonial/edit/" + testimonial.id}
                        className="flex gap-3  items-center  cursor-pointer hover:text-slate-700"
                      >
                        <Pencil1Icon className="w-5 h-5" />
                        <span>Edit</span>
                      </Link>
                      <Protected action="hide" roles={["ADMIN"]}>
                        <AlertDialog
                          onConfirm={() => handleDelete(testimonial.id)}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestimonialList;
