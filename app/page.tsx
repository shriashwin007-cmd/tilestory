import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
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
        <Hero />
        <About />
        <Catalog />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
