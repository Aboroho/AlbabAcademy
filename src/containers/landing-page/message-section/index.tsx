import React from "react";
import MessageCard from "./message-card";

type Props = {};

function MessageSection({}: Props) {
  return (
    <div
      className=" py-[5rem] "
      style={{
        background: "linear-gradient(115deg, #ffffff, #d4dfed)",
      }}
    >
      <div className="container">
        <div className="flex  gap-4 flex-wrap">
          <div className="lg:max-w-[48%] lg:min-w-[48%]">
            <MessageCard
              designation="Director"
              image="/assets/images/director.png"
              message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat quae voluptatum repellendus dolores nobis corrupti, consequatur hic eaque ab numquam, nostrum impedit similique animi dolorum nihil aperiam vero sapiente modi!"
              name="Abul Kalam"
              messageId={1}
            />
          </div>
          <div className=" lg:max-w-[48%] lg:min-w-[48%]">
            <MessageCard
              designation="Director"
              image="/assets/images/director.png"
              message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat quae voluptatum repellendus dolores nobis corrupti, consequatur hic eaque ab numquam, nostrum impedit similique animi dolorum nihil aperiam vero sapiente modi!"
              name="Al Mamun"
              messageId={1}
            />
          </div>
          <div className=" lg:max-w-[48%] lg:min-w-[48%]">
            <MessageCard
              designation="Director"
              image="/assets/images/director.png"
              message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat quae voluptatum repellendus dolores nobis corrupti, consequatur hic eaque ab numquam, nostrum impedit similique animi dolorum nihil aperiam vero sapiente modi!"
              name="Al Mamun"
              messageId={1}
            />
          </div>
          <div className=" lg:max-w-[48%] lg:min-w-[48%]">
            <MessageCard
              designation="Director"
              image="/assets/images/director.png"
              message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat quae voluptatum repellendus dolores nobis corrupti, consequatur hic eaque ab numquam, nostrum impedit similique animi dolorum nihil aperiam vero sapiente modi!"
              name="Al Mamun"
              messageId={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageSection;
