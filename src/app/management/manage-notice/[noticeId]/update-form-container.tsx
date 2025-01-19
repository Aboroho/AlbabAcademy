"use client";
import { useGetNoticeById } from "@/client-actions/queries/notice-queries";
import { Button } from "@/components/button";

import NoticeForm from "@/components/forms/notice-form";

import React from "react";

type Props = {
  noticeId: number;
};

function UpdateFormContainer({ noticeId }: Props) {
  const { data: notice, isLoading } = useGetNoticeById(noticeId);

  return (
    <div>
      <NoticeForm
        updateId={noticeId}
        defaultData={notice}
        isLoading={isLoading}
        updateEnabled={true}
        renderButton={(isSubmitting) => {
          return (
            <Button type="submit" disabled={isSubmitting}>
              Update Notice
            </Button>
          );
        }}
      />
    </div>
  );
}

export default UpdateFormContainer;
