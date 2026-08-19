import { headers } from "next/headers";
import Catalog from "@/components/Catalog/Catalog";
import MobileCatalog from "@/components/mobile/MobileCatalog";
import Footer from "@/components/Footer";
import CollectionsPageHeader from "@/components/CollectionsPageHeader";
import { getProducts } from "@/lib/data";

export const metadata = {
  title: "All Collections — Tile Story | Nungambakkam, Chennai",
  description: "Browse all 30+ Tile Story collections — flooring, bathroom, Moroccan, large slab, designer, imported, elevation and parking tiles.",
};

export default async function CollectionsPage() {
  const [products, deviceType] = await Promise.all([
    getProducts(),
    headers().then((h) => h.get("x-device-type")),
  ]);

  return (
    <>
      <CollectionsPageHeader />
      {deviceType === "mobile" ? (
        <MobileCatalog products={products} />
      ) : (
        <div className="frame">
          <main>
            <Catalog products={products} />
          </main>
        </div>
      )}
      <Footer />
    </>
  );
}
