import { VideoIcon } from "lucide-react";
import React from "react";

type Props = {};

function VideoGallary({}: Props) {
  return (
    <div className="bg-gray-100 pb-10">
      <div className="lg:py-10 py-5 pb-10 container">
        <div className="text-center mx-auto lg:w-[60%] lg:py-10 py-5">
          <div className="flex justify-center">
            <VideoIcon className="w-12 h-12 text-brand" />
          </div>
          <h2 className="text-[1.5rem] md:text-[1.7rem] lg:text-[2rem] tracking-wide mb-2">
            Video Gallery
          </h2>
          <p className="text-slate-800 text-sm">
            The Albab Academy aims at offering all our students a broad and
            balanced curriculum that provides rewarding and stimulating
            activities to prepare them for the best social and cultural life.
          </p>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/vDjaGYSidCI"
              title="Hifz Branch Coordinator, Sheikh Talha Masud on the importance of mask."
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={true}
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/vDjaGYSidCI"
              title="হিফজ শাখার কো-অর্ডিনেটর, শেখ তালহা মাসুদ কর্তৃক  মাশ্ক এর অংশবিশেষ।"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={true}
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/vDjaGYSidCI"
              title="হিফজ শাখার কো-অর্ডিনেটর, শেখ তালহা মাসুদ কর্তৃক  মাশ্ক এর অংশবিশেষ।"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={true}
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/vDjaGYSidCI"
              title="হিফজ শাখার কো-অর্ডিনেটর, শেখ তালহা মাসুদ কর্তৃক  মাশ্ক এর অংশবিশেষ।"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={true}
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoGallary;
