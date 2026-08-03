import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import MobileNav from "./MobileNav";
import MobileAbout from "./MobileAbout";
import MobileGallery from "./MobileGallery";
import MobileCatalog from "./MobileCatalog";
import MobileRewards from "./MobileRewards";
import MobileReviews from "./MobileReviews";
import MobileContact from "./MobileContact";
import MobileTabBar from "./MobileTabBar";
import type { Product } from "@/lib/products";
import type { Review } from "@/lib/data";

export default function MobileHome({ products, reviews }: { products: Product[]; reviews: Review[] }) {
  return (
    <>
      <MobileNav />
      <main style={{ paddingBottom: "4.5rem" }}>
        <Marquee />
        <MobileAbout />
        <MobileGallery />
        <MobileCatalog products={products} />
        <MobileRewards />
        <MobileReviews reviews={reviews} />
        <MobileContact />
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
