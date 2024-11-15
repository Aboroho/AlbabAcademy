import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

type Props = {
  trigger?: string | React.ReactNode;
  render: (close: () => void) => React.ReactNode;
  title: JSX.Element | string;
  description: JSX.Element | string;
  /**
   * Title and description will be hidden
   */
  sr_only?: boolean;

  /**
   * Applied to the modal container
   */
  className?: string;

  hideOnFocusOut?: boolean;
};

export default function Modal2({
  trigger,
  render,
  className,
  title,
  description,
  sr_only,
  hideOnFocusOut,
}: Props) {
  const [isOpen, toggleOpen] = useState(false);
  // const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    toggleOpen(!isOpen);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (hideOnFocusOut) toggleOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("max-h-[80vh] overflow-y-auto", className)}
        forceMount={true}
        //   hidDefaultClose={true}
      >
        <Cross1Icon
          className="w-4 h-4 absolute right-4 top-2 cursor-pointer"
          onClick={() => toggleOpen(false)}
        />
        <DialogTitle className={sr_only ? "sr-only" : ""}>{title}</DialogTitle>
        <DialogDescription className={sr_only ? "sr-only" : ""}>
          {description}
        </DialogDescription>

        <div className="relative p-2">{render(close)}</div>
      </DialogContent>
    </Dialog>
  );
}
