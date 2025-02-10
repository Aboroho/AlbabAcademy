"use client";

import { api } from "@/client-actions/helper";
import { useGetAllExpenses } from "@/client-actions/queries/expense-queries";
import { Protected } from "@/components/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import { formatDate } from "@/lib/utils";
import { Expense } from "@prisma/client";
import { DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

import { isEmpty } from "lodash";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Props = {};

function ExpenseList({}: Props) {
  const { data, isLoading } = useGetAllExpenses();
  const expenses = data?.expenses;

  const queryClient = useQueryClient();

  async function handleDelete(id: number) {
    toast.loading("Deleting expense...", { id: "delete-expense" });
    try {
      const res = await api("/expense/" + id, {
        method: "DELETE",
      });
      if (res.success) {
        toast.success("expense deleted");
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        queryClient.setQueryData(["expenses"], (prevData: Expense[]) => {
          return prevData?.filter((expense) => expense.id !== id);
        });
      } else {
        toast.error("Failed to delete expense");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Some error occured");
    } finally {
      toast.dismiss("delete-expense");
    }
  }

  function renderPayments() {
    return (
      <div className="max-h-[70vh] overflow-y-scroll">
        <table className="w-full mb-14">
          <thead>
            <th className="text-left">Title</th>
            <th className=" p-3 text-center">Amount</th>
            <th className="text-center p-3">Date</th>
            <th>Action</th>
          </thead>

          {isLoading && (
            <>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
              <tr className="w-full">
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
                <td>
                  <Skeleton className="w-full h-6" />
                </td>
              </tr>
            </>
          )}

          {expenses?.map((expense) => (
            <tr className="border-b  h-[65px]" key={expense.id}>
              <td className=" p-3 flex gap-4 items-center">{expense.title}</td>
              <td className="text-center p-3 text-green-500 font-bold">
                {expense.amount} ৳
              </td>
              <td className="text-center p-3">{formatDate(expense.date)}</td>
              <td className="text-right p-3">
                <div className=" flex gap-2 items-right justify-center">
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
                          href={"/management/expense/edit/" + expense.id}
                          className="flex gap-3  items-center  cursor-pointer hover:text-slate-700"
                        >
                          <Pencil1Icon className="w-5 h-5" />
                          <span>Edit</span>
                        </Link>
                        <Protected action="hide" roles={["ADMIN"]}>
                          <AlertDialog
                            onConfirm={() => handleDelete(expense.id)}
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
              </td>
            </tr>
          ))}
        </table>
        {!isLoading && isEmpty(expenses) && (
          <div className="text-sm text-gray-500 mb-10 text-center">
            No data found
          </div>
        )}
      </div>
    );
  }
  return <div>{renderPayments()}</div>;
}

export default ExpenseList;
