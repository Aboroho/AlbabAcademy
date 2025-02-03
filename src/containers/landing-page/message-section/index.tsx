import MessageCard from "./message-card";
import { prismaQ } from "@/app/api/utils/prisma";

type Props = {};

async function MessageSection({}: Props) {
  const testimonials = await prismaQ.testimonial.findMany();

  return (
    <div
      className=" py-[5rem] "
      style={{
        background: "linear-gradient(115deg, #ffffff, #d4dfed)",
      }}
    >
      <div className="container">
        <div className="flex  gap-4 flex-wrap">
          {testimonials.map((testimonials) => (
            <div
              className="lg:max-w-[48%] lg:min-w-[48%]"
              key={testimonials.id}
            >
              <MessageCard
                designation={testimonials.designation}
                image={testimonials.avatar}
                message={testimonials.message}
                name={testimonials.name}
                messageId={testimonials.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageSection;
