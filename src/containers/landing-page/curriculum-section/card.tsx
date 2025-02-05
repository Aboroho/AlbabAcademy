import { BookOpen } from "lucide-react";

type Props = {
  title: JSX.Element | string;
  description: JSX.Element | string;
  image: JSX.Element;
  buttonElem: JSX.Element;
};

function CurriculumCard({ title, description, image, buttonElem }: Props) {
  return (
    <div className="bg-accent/60 mt-4 flex flex-col gap-1 w-full md:w-[48%] lg:w-[32%] border rounded-xl hover:scale-[1.02] transition-transform duration-400 shadow-sm">
      <div className="image  w-auto overflow-hidden rounded flex justify-center items-center min-h-[300px] max-h-[360px]">
        {image}
      </div>
      <div className="p-4">
        <h3 className="text-[1rem] md:text-[1.2rem]  uppercase tracking-wide flex  gap-2 items-center">
          <BookOpen className="w-5 h-5 text-brand" />
          {title}
        </h3>
        <div className="text-slate-600 mt-1 text-sm">{description}</div>
        <div className="mt-4 ">{buttonElem}</div>
      </div>
    </div>
  );
}

export default CurriculumCard;
