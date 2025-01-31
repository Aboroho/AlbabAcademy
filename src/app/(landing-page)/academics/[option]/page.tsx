import CurriculumSection from "@/containers/landing-page/curriculum-section";

// type Props = {
//   params: Promise<{ option: string }>;
// };

async function Academics() {
  // const option = (await params).option;

  return (
    <div className="container min-h-[400px] py-10">
      <CurriculumSection />
    </div>
  );
}

export default Academics;
