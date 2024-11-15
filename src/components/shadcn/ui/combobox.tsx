"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";

type Option = {
  label: string;
  value: string;
  [key: string]: unknown;
};

type Props = {
  options?: Option[];
  onSelect: (selectedValue: string | undefined) => void;
  placeholder?: string;
  emptyText?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
  selectedValue?: string;
  rightIcon?: JSX.Element;
  renderOption?: (option: Option, iSelected: boolean) => JSX.Element;
};
export const Combobox = React.forwardRef<HTMLButtonElement, Props>(
  function Combobox(
    {
      options,
      onSelect,
      emptyText,
      placeholder,
      triggerClassName,
      popoverClassName,
      optionClassName,
      selectedValue,
      rightIcon,
      renderOption,
      disabled = false,
    }: Props,
    ref
  ) {
    const [open, setOpen] = React.useState(false);

    const triggerRef = React.useRef<HTMLButtonElement>(null);

    function handleOnSelect(selectedLabelPlusValue: string) {
      const selectedOption = options?.find(
        (option) => option.label + ":" + option.value === selectedLabelPlusValue
      );

      let newValue = "";

      if (selectedOption) {
        const unSelect = selectedOption.value === selectedValue;
        if (!unSelect) newValue = selectedOption.value;
      }

      onSelect(newValue);
      setOpen(false);
    }

    function renderSelectedValue() {
      const selectedOption = options?.find(
        (option) => option.value === selectedValue
      );

      if (selectedOption) {
        return selectedOption.label;
      } else {
        return placeholder || "No item selected";
      }
    }

    return (
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild ref={triggerRef}>
          <div className="flex gap-3 items-center">
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("flex justify-between w-full", triggerClassName)}
              disabled={disabled}
              type="button"
              aria-disabled={disabled}
            >
              {renderSelectedValue()}
              <ChevronsUpDown className="opacity-50" />
            </Button>
            <div onClick={(e) => e.stopPropagation()}> {rightIcon}</div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn("shadow-md pb-4 px-2", popoverClassName)}
          style={{ width: triggerRef.current?.scrollWidth }}
        >
          <Command>
            <CommandInput
              placeholder={placeholder ? placeholder : "Search..."}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {emptyText ? emptyText : "No data found."}
              </CommandEmpty>
              <CommandGroup>
                {options
                  ?.sort((a) => (a.value === selectedValue ? -1 : 0))
                  .map((option) => (
                    <CommandItem
                      className={cn("p-0", optionClassName)}
                      key={option.value}
                      value={option.label + ":" + option.value}
                      onSelect={handleOnSelect}
                    >
                      {!renderOption && (
                        <div className="p-2 flex justify-between w-full ">
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedValue === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </div>
                      )}

                      {renderOption &&
                        renderOption(option, selectedValue === option.value)}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
