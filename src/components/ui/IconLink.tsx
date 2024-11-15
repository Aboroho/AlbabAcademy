"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  href?: string;
  icon?: JSX.Element;
  label: string;
  rightIcon?: JSX.Element;
  selected?: boolean;
  active?: boolean;
};

function IconLink({ href, icon, label, rightIcon, selected, active }: Props) {
  function renderContent() {
    return (
      <div className="w-full items-center justify-center cursor-pointer select-none">
        <div className="flex w-full items-center justify-center">
          {icon && <div className="text mr-3 font-semibold ">{icon}</div>}
          <p className="mr-auto text-sm font-semibold">{label}</p>
          {rightIcon && (
            <div className="text ml-auto mr-4 font-semibold ">{rightIcon}</div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex w-full max-w-full items-center justify-between rounded-lg py-2.5 pl-4 font-semibold transition-all text-zinc-800 hover:bg-gray-100",
        selected && !active && " bg-gray-100 text-zinc-800 ",

        active && "bg-emerald-50 text-[#00A76F] hover:bg-emerald-100"
      )}
    >
      {href && (
        <Link href={href} className="w-full">
          {renderContent()}
        </Link>
      )}

      {!href && <>{renderContent()}</>}
    </div>
  );
}

export default IconLink;
