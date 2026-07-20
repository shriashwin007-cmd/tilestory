import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Catalog from "@/components/Catalog/Catalog";
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
          <Hero />
          <Marquee />
          <About />
          <Gallery />
          <Catalog products={products} />
          <Reviews reviews={reviews} />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
