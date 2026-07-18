import Nav from "@/components/Nav";
import Hero3D from "@/components/hero3d/Hero3DLoader";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Catalog from "@/components/Catalog/Catalog";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero3D />
        <Marquee />
        <About />
        <Catalog />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
