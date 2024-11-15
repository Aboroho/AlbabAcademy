"use client";

import Link from "next/link";

function TopbarNotice() {
  return (
    <div className="top-notice bg-yellow-300/80  relative h-[40px] overflow-hidden tracking-wide">
      <div className="notice-content whitespace-nowrap marquee-inner animation ">
        Our website is currently undergoing maintenance; we appreciate your
        patience and will be back shortly!
        <Link href="#" className="ml-4 text-sm underline">
          Read More
        </Link>
      </div>
    </div>
  );
}

export default TopbarNotice;
