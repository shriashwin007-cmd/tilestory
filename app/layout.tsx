import type { Metadata } from "next";
import { Big_Shoulders_Stencil } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import Mascot from "@/components/Mascot";
import FallingPetals from "@/components/FallingPetals";
import { RewardsProvider } from "@/components/Rewards/RewardsContext";
import PointToasts from "@/components/Rewards/PointToasts";

// One typeface, sitewide -- the actual stencil-cut face the user pointed
// to (visible bridges/gaps cut into the O, R, S, Y), not just "another bold
// grotesque." Big Shoulders Stencil is a real Google Font stencil face with
// both weight (100-900) and optical-size axes, so it stays legible down to
// small UI text (lighter weight, smaller opsz) while going full stencil-cut
// at large display sizes -- one family covers both instead of needing a
// second face for body copy. Kept the CSS variable name --font-fraunces so
// every component's var(--font-display)/var(--font-editorial)/
// var(--font-body)/var(--font-ui) reference in globals.css picks this up
// with a single-file change.
const fraunces = Big_Shoulders_Stencil({
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
