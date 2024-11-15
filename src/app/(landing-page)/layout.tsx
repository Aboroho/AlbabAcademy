import Footer from "@/containers/landing-page/footer";
import TopNav from "@/containers/landing-page/top-nav";
import TopbarNotice from "@/containers/landing-page/topbar-notice";

import { Roboto } from "next/font/google";
import "@/styles/landing-page.css";

const roboto = Roboto({
  weight: ["400", "700"],

  subsets: ["latin"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
};

function LandingPageLayout({ children }: Props) {
  return (
    <div className={roboto.className}>
      <TopbarNotice />
      <TopNav />
      <main className="max-w-[100vw] overflow-hidden">{children}</main>
      <Footer />
    </div>
  );
}

export default LandingPageLayout;
