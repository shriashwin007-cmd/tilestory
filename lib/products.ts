export type Product = {
  id: string;
  name: string;
  category: string;
  colors: string[];
  finish: string;
  size: string;
  use: string[];
  desc: string;
  image: string;
  tags: string[];
};

export const CATEGORIES = [
  "Flooring",
  "Bathroom",
  "Moroccan",
  "Large Slab",
  "Designer",
  "Imported",
  "Elevation",
  "Parking"
] as const;
export const FINISHES = [
  "Matte",
  "Polished",
  "Glossy",
  "Textured",
  "Anti-Slip"
] as const;
export const SIZES = [
  "600x1200mm",
  "800x800mm",
  "200x1200mm",
  "800x1600mm",
  "300x600mm",
  "75x150mm",
  "200x200mm",
  "200x230mm",
  "1600x3200mm",
  "1200x2400mm",
  "600x600mm",
  "300x300mm",
  "400x1200mm",
  "Custom Mosaic",
  "200x400mm",
  "400x600mm",
  "200mm Hexagon"
] as const;

