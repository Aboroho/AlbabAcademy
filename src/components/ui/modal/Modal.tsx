import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type Props = {
  trigger?: string | React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string | JSX.Element;
  className?: string;
};

export type ModalRefType = {
  trigger: () => void;
  close: () => void;
};
export const Modal = forwardRef<ModalRefType, Props>(function Modal(
  { trigger, children, title, description, className }: Props,
  ref
) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => {
    return {
      trigger: () => {
        // triggerRef.current?.click();
        setOpen(true);
      },
      close: () => {
        // closeRef.current?.click();
        console.log("close", closeRef.current);
        setOpen(false);
      },
    };
  });
  console.log("redered");
  return (
    <Dialog onOpenChange={() => setOpen(!open)} open={open}>
      <DialogTrigger asChild ref={triggerRef}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className={cn("max-h-[80vh] overflow-y-auto", className)}
        forceMount={true}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && (
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        )}

        {children}

        <DialogClose ref={closeRef}></DialogClose>
      </DialogContent>
    </Dialog>
  );
});
