import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Catalog from "@/components/Catalog/Catalog";
import Rewards from "@/components/Rewards/Rewards";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProducts, getReviews } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [products, reviews] = await Promise.all([getProducts(), getReviews()]);

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
