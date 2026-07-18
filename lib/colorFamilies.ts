export type ColorFamily = { name: string; hex: string; match: string[] };

export const COLOR_FAMILIES: ColorFamily[] = [
  { name: "White", hex: "#F5F5F5", match: ["#FFFFFF", "#FAFAFA", "#F8F8F8", "#F5F5F5", "#EBEBEB", "#E8E8E8"] },
  { name: "Gray", hex: "#A9A9A9", match: ["#8B8B8B", "#A9A9A9", "#C0C0C0", "#D3D3D3", "#808080", "#696969", "#909090", "#A8A8A8", "#4A4A4A", "#708090"] },
  { name: "Black", hex: "#1C1C1C", match: ["#1C1C1C"] },
  { name: "Blue", hex: "#1E3A8A", match: ["#1E3A8A", "#2563EB", "#4682B4", "#2F4F4F"] },
  { name: "Gold", hex: "#DAA520", match: ["#DAA520", "#FFD700", "#F59E0B", "#FBBF24", "#D4902A"] },
  { name: "Beige", hex: "#D2B48C", match: ["#F5DEB3", "#D2B48C", "#E8D5C4", "#DEB887", "#F4A460"] },
  { name: "Brown", hex: "#8B7355", match: ["#8B7355", "#A0826D", "#C19A6B", "#8B4513", "#CD853F", "#D2691E", "#BC8F8F"] },
  { name: "Terracotta", hex: "#CD5C5C", match: ["#CD5C5C", "#F97316"] },
  { name: "Green", hex: "#78716C", match: ["#78716C"] },
];
