import { Facebook, Mail, MapPin, PhoneOutgoing, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";
import { facebookUrl } from "../../../../constants/global";
import Image from "next/image";
import LogoDesktop from "@/assets/images/logo_desktop.png";

function Footer() {
  return (
    <footer className=" border-t bg-primary text-slate-100  -z-20" id="footer">
      <div className="relative">
        <div className=" z-20">
          <div className="container">
            <div className="footer-top pt-[5rem] pb-[3rem]">
              <div className="space-y-5 pb-5 border-b border-slate-50/50">
                <div className="row flex flex-col flex-wrap gap-10 lg:gap-4 md:flex-row ">
                  <div className="space-y-4  md:w-[48%] lg:w-[32%]">
                    <Image
                      src={LogoDesktop}
                      alt="Albab academy logo"
                      height={48}
                      className="mb-7"
                    />
                    <div className="flex gap-2  items-start ">
                      <MapPin className="w-4 h-4" />
                      <address className=" text-sm max-w-[200px] tracking-wide">
                        House no. 51, M A Bari Road (Alir Club), Sonadanga,
                        Khulna, Bangladesh.
                      </address>
                    </div>
                    <div className="flex gap-2  items-start italic text-sm  tracking-wide">
                      <PhoneOutgoing className="w-4 h-4" />
                      <span className="">+8801302994819</span>
                    </div>
                    <div className="flex gap-2 items-start italic text-sm  tracking-wide">
                      <Mail className="w-4 h-4" />
                      <span className="">albabacademyinfo@gmail.com</span>
                    </div>
                  </div>
                  <div className="map  md:w-[45%]  lg:w-[32%] ">
                    <div className="w-full h-[250px] bg-slate-100 border-2 p-1 rounded-md border-brand">
                      <iframe
                        allowFullScreen={true}
                        className="w-full h-full overflow-hidden"
                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Khulna%2C%20Sonadanga%2CMA%20Bari%20Road%2CAlbab%20Academy&zoom=18&maptype=roadmap"
                      ></iframe>
                    </div>
                  </div>
                  <div className="empty  md:w-[45%] lg:w-[32%] "></div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center md:justify-between pt-4">
                  <div className="flex gap-4">
                    <Link
                      href=""
                      className="text-sm flex gap-2 items-center  tracking-wide text-primary hover:text-brand"
                    >
                      Contact
                    </Link>
                    <Link
                      href=""
                      className=" tracking-wide text-sm flex gap-2 items-center text-primary"
                    >
                      Admission
                    </Link>
                    <Link
                      href=""
                      className="  tracking-wide text-sm flex gap-2 items-center text-primary"
                    >
                      About us
                    </Link>
                    <Link
                      href=""
                      className=" tracking-wide text-sm flex gap-2 items-center text-primary"
                    >
                      Payment
                    </Link>
                  </div>
                  <div className="social-links flex gap-3">
                    <Link
                      href={facebookUrl}
                      target="_blank"
                      className="text-sm flex gap-2 items-center"
                    >
                      <Facebook className="w-4 h-4" />
                    </Link>
                    <Link href="" className="text-sm flex gap-2 items-center">
                      <Twitter className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
