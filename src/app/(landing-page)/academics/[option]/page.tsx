type Props = {
  params: Promise<{ option: string }>;
};

async function Academics({ params }: Props) {
  const option = (await params).option;

  return (
    <div className="container min-h-[400px] py-10">
      <h1 className="text-2xl">{option.replaceAll("-", " ")}</h1>
      <div>Comming soon..</div>
    </div>
  );
}

export default Academics;
