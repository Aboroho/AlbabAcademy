import { Skeleton } from "@/components/shadcn/ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: 7 }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton className="h-8" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
