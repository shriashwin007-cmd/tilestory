import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import Mascot from "@/components/Mascot";
import { RewardsProvider } from "@/components/Rewards/RewardsContext";
import PointToasts from "@/components/Rewards/PointToasts";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Bold structural grotesque for headlines, replacing the earlier serif
// (Fraunces) — that pairing (large serif + small-caps sans labels) is
// exactly the look every "editorial luxury" AI-built site converges on
// right now. Bricolage Grotesque is graphic and slightly quirky rather
// than literary/hushed, which reads as more specific to an actual tile
// showroom (geometric, grid-based product) than a fashion-brand serif.
// Kept the CSS variable name --font-fraunces so every component's
// var(--font-display)/var(--font-editorial) reference in globals.css
// picks this up with a single-file change.
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
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
