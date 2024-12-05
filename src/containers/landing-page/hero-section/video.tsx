"use client";

function HeroVideo() {
  return (
    <div className="w-full relative">
      <video
        className="w-full h-full"
        src="/assets/video/intro.mp4"
        controls
      ></video>
    </div>
  );
}

export default HeroVideo;
