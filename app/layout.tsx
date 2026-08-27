import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import Mascot from "@/components/Mascot";
import FallingPetals from "@/components/FallingPetals";
import { RewardsProvider } from "@/components/Rewards/RewardsContext";
import PointToasts from "@/components/Rewards/PointToasts";

// One typeface, sitewide -- Inter (previously the body/UI font) has been
// dropped entirely rather than just unreferenced, so the site doesn't ship
// a second web font that nothing uses. Bricolage Grotesque is graphic and
// slightly quirky rather than literary/hushed, which reads as more specific
// to an actual tile showroom (geometric, grid-based product) than a
// fashion-brand serif. Kept the CSS variable name --font-fraunces so every
// component's var(--font-display)/var(--font-editorial)/var(--font-body)/
// var(--font-ui) reference in globals.css picks this up with a single-file
// change.
const fraunces = Bricolage_Grotesque({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Tile Story — Premium Designer Tiles | Nungambakkam, Chennai",
  description:
    "Chennai's premier designer tile showroom. Premium flooring, Moroccan, large slab, bathroom and imported tiles. Same-day delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body>
        <div className="grain" aria-hidden="true" />
        <FallingPetals />
        <SmoothScroll />
        <ScrollProgress />
        <RewardsProvider>
          {children}
          <PointToasts />
        </RewardsProvider>
        <Mascot />
      </body>
    </html>
  );
}
