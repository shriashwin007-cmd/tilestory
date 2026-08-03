import { headers } from "next/headers";
import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Catalog from "@/components/Catalog/Catalog";
import Rewards from "@/components/Rewards/Rewards";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileHome from "@/components/mobile/MobileHome";
import { getProducts, getReviews } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [[products, reviews], deviceType] = await Promise.all([
    Promise.all([getProducts(), getReviews()]),
    headers().then((h) => h.get("x-device-type")),
  ]);

  // Genuinely separate mobile build (see proxy.ts for the server-side UA
  // detection), not just a responsive breakpoint -- same URL, decided
  // before any HTML is sent.
  if (deviceType === "mobile") {
    return <MobileHome products={products} reviews={reviews} />;
  }

  return (
    <>
      <Nav />
      <div className="frame">
        <main>
          <Marquee />
          <About />
          <Gallery />
          <Catalog products={products} />
          <Rewards />
          <Reviews reviews={reviews} />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
