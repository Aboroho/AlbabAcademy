import AboutSection from "@/containers/landing-page/about-section";
import CurriculumSection from "@/containers/landing-page/curriculum-section";
import HeroSection from "@/containers/landing-page/hero-section";
import MotivationSection from "@/containers/landing-page/motivation-section";
import Slider from "@/containers/landing-page/slider-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Albab Academy | Illuminating mind, Enriching Souls",
  description: "Leading ...",
};
export default function Home() {
  return (
    <div>
      <Slider />
      <HeroSection />

      <AboutSection />

      <CurriculumSection />
      <MotivationSection />
    </div>
  );
}
