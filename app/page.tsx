import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import ScrollVideo from "@/components/ScrollVideo";
import Gallery from "@/components/Gallery";
import Catalog from "@/components/Catalog/Catalog";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="frame">
        <main>
          <Hero />
          <Marquee />
          <About />
          <ScrollVideo />
          <Gallery />
          <Catalog />
          <Reviews />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
