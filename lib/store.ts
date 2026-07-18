export const STORE = {
  name: "Tile Story",
  tagline: "Premium Designer Tiles",
  phoneDisplay: "+91 89391 35853",
  phoneTel: "+918939135853",
  whatsapp: "918939135853",
  email: "tilestory@gmail.com",
  address: "1 Sterling Road, Opposite Hard Rock Cafe, Nungambakkam, Chennai 600034",
  hours: "Mon–Sat: 9:00 AM – 7:00 PM · Sunday: 10:00 AM – 5:00 PM",
  rating: "4.85",
  instagram: "@tilestory",
  mapsUrl: "https://maps.google.com/?q=1+Sterling+Road+Nungambakkam+Chennai",
} as const;

export function waLink(message: string): string {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}
