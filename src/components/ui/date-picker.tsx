"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";

type Props = {
  defaultDate: Date | undefined;
  onSelect: (date: Date) => void;
  className?: string;
};
export function DatePicker({ defaultDate, onSelect, className }: Props) {
  // console.log(defaultDate);
  const [date, setDate] = React.useState<Date | undefined>(
    defaultDate || new Date()
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => {
            if (day) {
              setOpen(false);
              setDate(day);
              onSelect(day);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
