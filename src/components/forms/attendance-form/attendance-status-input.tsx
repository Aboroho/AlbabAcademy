import React from "react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

type Props = {
  status: "PRESENT" | "ABSENT" | "NO_DATA";
  onChangeStatus: (status: "PRESENT" | "ABSENT" | "NO_DATA") => void;
};

function AttendanceStatusInput({ status, onChangeStatus }: Props) {
  const presentClass =
    status === "PRESENT" ? "bg-green-500 text-white hover:bg-green-600" : "";
  const absentClass =
    status === "ABSENT" ? "bg-red-500 text-white hover:bg-red-600" : "";
  const noDataClass =
    status === "NO_DATA" ? "bg-gray-500 text-white hover:bg-gray-600" : "";
  return (
    <div className="flex gap-2">
      <Button
        className={cn(
          " rounded-full bg-gray-300 hover:bg-green-600 hover:text-white text-black",
          presentClass
        )}
        size="sm"
        onClick={() => onChangeStatus("PRESENT")}
      >
        P
      </Button>
      <Button
        className={cn(
          " rounded-full bg-gray-300 hover:bg-red-500 hover:text-white text-black",
          absentClass
        )}
        size="sm"
        onClick={() => onChangeStatus("ABSENT")}
      >
        A
      </Button>
      <Button
        className={cn(" rounded-full bg-gray-300  text-black", noDataClass)}
        size="sm"
        onClick={() => onChangeStatus("NO_DATA")}
      >
        N
      </Button>
    </div>
  );
}

export default AttendanceStatusInput;
