import React, { useRef } from "react";
import { Modal, ModalRefType } from "./Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  onConfirm: () => void;
  message?: string | JSX.Element;
  confirmText: string;
  confirmButtonClassName?: string;
  title?: string;
};

function AlertDialog({
  children,
  onConfirm,
  message,
  confirmText,
  confirmButtonClassName,
  title,
}: Props) {
  const deleteModalRef = useRef<ModalRefType>(null);
  return (
    <Modal
      ref={deleteModalRef}
      trigger={children}
      title={title || "Confirm Action"}
      description={message ? message : "Are you sure to do this action?"}
    >
      <div className="bg-white ">
        <div className="flex justify-end gap-2">
          <Button
            className={cn("bg-red-500 hover:bg-inital", confirmButtonClassName)}
            onClick={() => {
              onConfirm();
              deleteModalRef.current?.close();
            }}
          >
            {confirmText ? confirmText : "Confirm"}
          </Button>
          <Button
            variant="outline"
            onClick={() => deleteModalRef.current?.close()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AlertDialog;
