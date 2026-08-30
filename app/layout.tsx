import type { Metadata } from "next";
import { Big_Shoulders_Stencil } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import Mascot from "@/components/Mascot";
import FallingPetals from "@/components/FallingPetals";
import { RewardsProvider } from "@/components/Rewards/RewardsContext";
import PointToasts from "@/components/Rewards/PointToasts";
import { STORE } from "@/lib/store";
import { getReviews } from "@/lib/data";

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

const SITE_URL = "https://tilestoryindia.com";
const TITLE = "Tile Story — Premium Designer Tiles | Nungambakkam, Chennai";
const DESCRIPTION =
  "Chennai's premier designer tile showroom. Premium flooring, Moroccan, large slab, bathroom and imported tiles. Same-day delivery.";

export const metadata: Metadata = {
  // Lets every relative URL below (OG image, canonical) resolve correctly
  // regardless of which Vercel/preview domain actually served the request.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "tile showroom Chennai",
    "designer tiles Chennai",
    "Moroccan tiles",
    "imported marble Chennai",
    "bathroom tiles Chennai",
    "flooring tiles Nungambakkam",
    "Tile Story",
  ],
  alternates: {
    canonical: "/",
  },
  // Explicitly allow indexing (Next defaults to this, but spelling it out
  // means a future change elsewhere can't silently noindex the whole site).
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Tile Story",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    images: [{ url: "/images/showroom.webp", width: 1200, height: 900, alt: "Tile Story showroom, Nungambakkam, Chennai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/showroom.webp"],
  },
};

// Local-business structured data (schema.org JSON-LD) -- this is what lets
// Google show the address/hours/rating as a rich local-search result
// (and feeds Google Maps/Business Profile matching) instead of just a plain
// blue link. Built from the same STORE constants every other component
// already renders, so it can't drift out of sync with what's on the page.
async function buildLocalBusinessJsonLd() {
  // Google's review-snippet validator requires ratingCount alongside
  // ratingValue -- and per Google's structured-data policy that count has
  // to reflect real reviews, not a marketing number, so it's pulled from
  // the same Supabase table the Reviews section renders rather than
  // hardcoded. No real reviews yet means no honest aggregateRating to
  // publish, so the field is dropped entirely rather than faked.
  const reviews = await getReviews().catch(() => []);

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: STORE.name,
    image: `${SITE_URL}/images/showroom.webp`,
    url: SITE_URL,
    telephone: STORE.phoneTel,
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Sterling Road, Opposite Hard Rock Cafe",
      addressLocality: "Nungambakkam, Chennai",
      postalCode: "600034",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "17:00",
      },
    ],
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: STORE.rating,
            ratingCount: reviews.length,
            bestRating: "5",
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = await buildLocalBusinessJsonLd();
  return (
    <html lang="en" className={fraunces.variable}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
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
