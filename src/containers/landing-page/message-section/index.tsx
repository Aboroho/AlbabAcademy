"use client";
import { useGetAllTestimonial } from "@/client-actions/queries/testimonial-queries";
import MessageCard from "./message-card";
import { Skeleton } from "@/components/shadcn/ui/skeleton";

type Props = {};

function MessageSection({}: Props) {
  const { data: testimonials, isLoading } = useGetAllTestimonial();

  return (
    <>
      <div
        className=" py-[5rem] "
        style={{
          background: "linear-gradient(115deg, #ffffff, #d4dfed)",
        }}
      >
        <div className="container">
          <div className="flex gap-4 flex-wrap">
            {isLoading && (
              <>
                <div
                  className="flex gap-6  border-2 border-brand lg:p-10 rounded-md shadow-lg flex-col lg:flex-row p-4"
                  style={{
                    background:
                      "linear-gradient(115deg, #ffffff, #eeeeee, #ffffff)",
                  }}
                >
                  <div className="p-2 rounded-full border-primary relative self-center ">
                    <div className="absolute w-[128px] h-[128px] rounded-full p-4 bg-brand -z-10 top-[-10px] left-[-30px] opacity-40"></div>
                    <div className="w-[128px] h-[128px] rounded-full p-4 bg-primary z-[20]"></div>
                  </div>
                  <div className="flex flex-col gap-6 lg:pt-10">
                    <div className="text-gray-600 flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="w-[300px] h-[10px]" />
                        <Skeleton className="w-[300px] h-[10px]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className=" text-xl text-primary"
                        style={{
                          background:
                            "-webkit-linear-gradient(115deg, #262935, #b30938)",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        <Skeleton className="w-[120px] h-[10px]" />
                      </div>
                      <div className="text-slate-700 text-sm">
                        <Skeleton className="w-[100px] h-[10px]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex gap-6  border-2 border-brand lg:p-10 rounded-md shadow-lg flex-col lg:flex-row p-4"
                  style={{
                    background:
                      "linear-gradient(115deg, #ffffff, #eeeeee, #ffffff)",
                  }}
                >
                  <div className="p-2 rounded-full border-primary relative self-center ">
                    <div className="absolute w-[128px] h-[128px] rounded-full p-4 bg-brand -z-10 top-[-10px] left-[-30px] opacity-40"></div>
                    <div className="w-[128px] h-[128px] rounded-full p-4 bg-primary z-[20]"></div>
                  </div>
                  <div className="flex flex-col gap-6 lg:pt-10">
                    <div className="text-gray-600 flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="w-[300px] h-[10px]" />
                        <Skeleton className="w-[300px] h-[10px]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className=" text-xl text-primary"
                        style={{
                          background:
                            "-webkit-linear-gradient(115deg, #262935, #b30938)",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        <Skeleton className="w-[120px] h-[10px]" />
                      </div>
                      <div className="text-slate-700 text-sm">
                        <Skeleton className="w-[100px] h-[10px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex  gap-4 flex-wrap">
            {testimonials?.map((testimonials) => (
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
    </>
  );
}

export default MessageSection;
