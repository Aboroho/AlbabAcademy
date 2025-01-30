import React from "react";

type Props = {};

function VideoGallary({}: Props) {
  return (
    <div className="py-10 container">
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
  );
}

export default VideoGallary;
