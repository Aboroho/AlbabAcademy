"use client";

import { api } from "@/client-actions/helper";
import { useGetPaymentTemplates } from "@/client-actions/queries/payment-queries";
import { Button } from "@/components/button";

import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@/components/shadcn/ui/accordion";
import AlertDialog from "@/components/ui/modal/AlertDialog";
import { IPaymentTemplateResponse } from "@/types/response_types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

type Props = {};

function PaymentTemplates({}: Props) {
  const { data: templates, isLoading } = useGetPaymentTemplates();

  const queryClient = useQueryClient();
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await api("/payment/templates/" + id, {
        method: "DELETE",
      });
      return result;
    },

    onSuccess(deleteReponse) {
      queryClient.setQueriesData(
        { queryKey: ["payment-templates", "all"] },
        (prevData?: IPaymentTemplateResponse[]) => {
          if (!prevData || isEmpty(prevData) || !deleteReponse.success)
            return prevData as IPaymentTemplateResponse[];

          return prevData.filter(
            (template) => template.id !== parseInt(deleteReponse.data as string)
          );
        }
      );
    },
  });
  async function handleDelete(id: number) {
    toast.loading("Deleting template", { id: "template-delete" });
    try {
      const result = await deleteTemplateMutation.mutateAsync(id);
      if (result.success) {
        toast.success("Template deleted successfully");
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      toast.dismiss("template-delete");
    }
  }

  return (
    <div className="max-w-[768px] px-2 lg:px-4">
      <h1 className="text-2xl mb-4 flex gap-2 items-center ">
        Payment Templates{" "}
        {isLoading && <LoaderCircle className="animate-spin w-4 h-4 mt-1.5" />}
      </h1>
      {isLoading && (
        <div className="text-center">Fetching payment templates..</div>
      )}
      <Accordion type="multiple">
        {templates?.map((template) => (
          <div key={template.id}>
            <AccordionItem value={template.name}>
              <AccordionTrigger className="hover:">
                <div>{template.name}</div>
              </AccordionTrigger>
              <AccordionContent>
                {template.template_fields.map((field) => (
                  <div key={field.id} className="flex justify-between px-5">
                    <div>{field.description}</div>
                    <div>{field.amount} ৳</div>
                  </div>
                ))}
                <div className="text-right border-t mt-2 px-4 py-2">
                  Total :{" "}
                  {template.template_fields.reduce(
                    (sum, cur) => sum + cur.amount,
                    0
                  )}{" "}
                  ৳
                </div>

                <div className="text-right px-4">
                  <AlertDialog
                    onConfirm={() => {
                      handleDelete(template.id);
                    }}
                    confirmText="Are you sure to delete?"
                  >
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </AlertDialog>
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </div>
  );
}

export default PaymentTemplates;
