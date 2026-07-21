import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import { RewardsProvider } from "@/components/Rewards/RewardsContext";
import PointToasts from "@/components/Rewards/PointToasts";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Large elegant serif for headlines — moody editorial feel, paired with
// Inter's small uppercase spaced-out labels for contrast.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
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
        <CustomCursor />
        <RewardsProvider>
          {children}
          <PointToasts />
        </RewardsProvider>
      </body>
    </html>
  );
}
