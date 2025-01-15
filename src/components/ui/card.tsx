const Card = ({
  value,
  count,
  className,
}: {
  value: string;
  count: number;
  className?: string;
}) => {
  const date = new Date().getFullYear();
  return (
    <div
      className={
        "rounded-2xl odd:bg-purple-200 even:bg-yellow-200 p-4 flex-1 min-w-[130px] " +
        className
      }
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {date}
        </span>
        {/* <Image src="/more.png" alt="" width={20} height={20} /> */}
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{value}</h2>
    </div>
  );
};

export default Card;
