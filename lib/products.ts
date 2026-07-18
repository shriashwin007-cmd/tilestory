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

export const PRODUCTS: Product[] = [
  {
    "id": "TS001",
    "name": "Nordic Gray Wood",
    "category": "Flooring",
    "colors": [
      "#8B8B8B",
      "#A9A9A9",
      "#D3D3D3"
    ],
    "finish": "Matte",
    "size": "600x1200mm",
    "use": [
      "Living Room",
      "Bedroom"
    ],
    "desc": "Scandinavian-inspired wood-look porcelain with realistic grain texture",
    "image": "living_room_1.jpg",
    "tags": [
      "wood-look",
      "modern",
      "gray"
    ]
  },
  {
    "id": "TS002",
    "name": "Carrara White Marble",
    "category": "Flooring",
    "colors": [
      "#F5F5F5",
      "#E8E8E8",
      "#BEBEBE"
    ],
    "finish": "Polished",
    "size": "800x800mm",
    "use": [
      "Bedroom",
      "Lobby"
    ],
    "desc": "Classic Italian white marble with subtle gray veining",
    "image": "living_room_2.jpg",
    "tags": [
      "marble",
      "luxury",
      "white"
    ]
  },
  {
    "id": "TS003",
    "name": "Warm Oak Plank",
    "category": "Flooring",
    "colors": [
      "#C19A6B",
      "#8B7355",
      "#D2B48C"
    ],
    "finish": "Matte",
    "size": "200x1200mm",
    "use": [
      "Living Room",
      "Kitchen"
    ],
    "desc": "Natural oak wood-look tile with warm honey tones",
    "image": "living_room_3.jpg",
    "tags": [
      "wood-look",
      "warm",
      "natural"
    ]
  },
  {
    "id": "TS004",
    "name": "Imperial Gray Marble",
    "category": "Flooring",
    "colors": [
      "#A8A8A8",
      "#909090",
      "#C0C0C0"
    ],
    "finish": "Polished",
    "size": "800x1600mm",
    "use": [
      "Living Room",
      "Dining"
    ],
    "desc": "Large format gray marble with elegant veining pattern",
    "image": "large_slab_4.jpg",
    "tags": [
      "marble",
      "gray",
      "large-format"
    ]
  },
  {
    "id": "TS005",
    "name": "Azure Gold Luxury",
    "category": "Bathroom",
    "colors": [
      "#4682B4",
      "#DAA520",
      "#2F4F4F"
    ],
    "finish": "Glossy",
    "size": "600x1200mm",
    "use": [
      "Bathroom",
      "Shower"
    ],
    "desc": "Dramatic blue marble with gold veining — statement bathroom walls",
    "image": "bathroom_3.jpg",
    "tags": [
      "luxury",
      "blue",
      "gold",
      "marble"
    ]
  },
  {
    "id": "TS006",
    "name": "Sahara Beige Textured",
    "category": "Bathroom",
    "colors": [
      "#F5DEB3",
      "#D2B48C",
      "#E8D5C4"
    ],
    "finish": "Matte",
    "size": "300x600mm",
    "use": [
      "Bathroom",
      "Powder Room"
    ],
    "desc": "Soft beige with ribbed texture accent strip for spa-like bathrooms",
    "image": "bathroom_1.jpg",
    "tags": [
      "beige",
      "textured",
      "neutral"
    ]
  },
  {
    "id": "TS007",
    "name": "Nero Marquina Black",
    "category": "Bathroom",
    "colors": [
      "#1C1C1C",
      "#FFFFFF",
      "#DAA520"
    ],
    "finish": "Polished",
    "size": "600x1200mm",
    "use": [
      "Shower",
      "Feature Wall"
    ],
    "desc": "Luxurious black marble with white veins — pairs with gold fixtures",
    "image": "bathroom_2.jpg",
    "tags": [
      "black",
      "marble",
      "luxury",
      "gold-accent"
    ]
  },
  {
    "id": "TS008",
    "name": "Pearl White Subway",
    "category": "Bathroom",
    "colors": [
      "#FAFAFA",
      "#E0E0E0",
      "#F8F8F8"
    ],
    "finish": "Glossy",
    "size": "75x150mm",
    "use": [
      "Bathroom",
      "Kitchen Backsplash"
    ],
    "desc": "Timeless white subway tiles with subtle pearl shimmer",
    "image": "bathroom_2.jpg",
    "tags": [
      "white",
      "classic",
      "subway"
    ]
  },
  {
    "id": "TS009",
    "name": "Fes Blue Pattern",
    "category": "Moroccan",
    "colors": [
      "#1E3A8A",
      "#F59E0B",
      "#FBBF24"
    ],
    "finish": "Matte",
    "size": "200x200mm",
    "use": [
      "Kitchen",
      "Bathroom",
      "Feature Wall"
    ],
    "desc": "Handcrafted Moroccan encaustic tiles — blue, gold, cream geometric patterns",
    "image": "moraccan_1.jpg",
    "tags": [
      "pattern",
      "blue",
      "traditional",
      "handcrafted"
    ]
  },
  {
    "id": "TS010",
    "name": "Marrakech Kitchen Mix",
    "category": "Moroccan",
    "colors": [
      "#2563EB",
      "#F97316",
      "#78716C"
    ],
    "finish": "Matte",
    "size": "200x200mm",
    "use": [
      "Kitchen Floor",
      "Backsplash"
    ],
    "desc": "Mixed Moroccan pattern tiles — kitchen and dining floors",
    "image": "moraccan_2.jpg",
    "tags": [
      "pattern",
      "blue",
      "orange",
      "mix"
    ]
  },
  {
    "id": "TS011",
    "name": "Hexwood Gold Accent",
    "category": "Moroccan",
    "colors": [
      "#A0826D",
      "#DAA520",
      "#8B7355"
    ],
    "finish": "Matte",
    "size": "200x230mm",
    "use": [
      "Feature Wall",
      "Living Room"
    ],
    "desc": "Geometric hexagon tiles with wood texture and gold brass inlay",
    "image": "moraccan_3.jpg",
    "tags": [
      "hexagon",
      "wood",
      "gold",
      "geometric"
    ]
  },
  {
    "id": "TS012",
    "name": "Calacatta Gold Vein",
    "category": "Large Slab",
    "colors": [
      "#FAFAFA",
      "#DAA520",
      "#E8E8E8"
    ],
    "finish": "Polished",
    "size": "1600x3200mm",
    "use": [
      "Living Room",
      "Lobby",
      "Feature Wall"
    ],
    "desc": "Book-matched Calacatta marble slabs with dramatic gold veining",
    "image": "large_slab_2.jpg",
    "tags": [
      "marble",
      "gold",
      "book-matched",
      "XXL"
    ]
  },
  {
    "id": "TS013",
    "name": "Silver Cloud Marble",
    "category": "Large Slab",
    "colors": [
      "#D3D3D3",
      "#A9A9A9",
      "#F5F5F5"
    ],
    "finish": "Polished",
    "size": "800x1600mm",
    "use": [
      "Living Room",
      "Dining"
    ],
    "desc": "Contemporary gray marble with cloud-like patterns — large format slabs",
    "image": "large_slab_3.jpg",
    "tags": [
      "gray",
      "marble",
      "contemporary"
    ]
  },
  {
    "id": "TS014",
    "name": "Platinum Vein Slab",
    "category": "Large Slab",
    "colors": [
      "#C0C0C0",
      "#808080",
      "#EBEBEB"
    ],
    "finish": "Polished",
    "size": "1200x2400mm",
    "use": [
      "Lobby",
      "Living Room"
    ],
    "desc": "Premium gray marble slabs with linear platinum veining",
    "image": "large_slab_1.jpg",
    "tags": [
      "gray",
      "marble",
      "linear",
      "premium"
    ]
  },
  {
    "id": "TS015",
    "name": "Emperador Gold XL",
    "category": "Large Slab",
    "colors": [
      "#8B7355",
      "#DAA520",
      "#D2B48C"
    ],
    "finish": "Polished",
    "size": "1600x3200mm",
    "use": [
      "Feature Wall",
      "Lobby"
    ],
    "desc": "Statement brown marble slabs with symmetrical gold accents",
    "image": "large_slab_2.jpg",
    "tags": [
      "brown",
      "gold",
      "statement",
      "XXL"
    ]
  },
  {
    "id": "TS016",
    "name": "Industrial Concrete Gray",
    "category": "Designer",
    "colors": [
      "#808080",
      "#696969",
      "#D3D3D3"
    ],
    "finish": "Matte",
    "size": "600x600mm",
    "use": [
      "Dining",
      "Office",
      "Commercial"
    ],
    "desc": "Modern industrial concrete-look tiles with natural texture variation",
    "image": "designer_2.jpg",
    "tags": [
      "concrete",
      "industrial",
      "gray"
    ]
  },
  {
    "id": "TS017",
    "name": "Terracotta Earth Tone",
    "category": "Designer",
    "colors": [
      "#CD5C5C",
      "#D2691E",
      "#BC8F8F"
    ],
    "finish": "Matte",
    "size": "300x300mm",
    "use": [
      "Bedroom",
      "Rustic Spaces"
    ],
    "desc": "Warm terracotta clay tiles — Mediterranean charm for bedrooms",
    "image": "designer_3.jpg",
    "tags": [
      "terracotta",
      "warm",
      "rustic",
      "earth"
    ]
  },
  {
    "id": "TS018",
    "name": "3D Wave White Panel",
    "category": "Designer",
    "colors": [
      "#FFFFFF",
      "#F5F5F5",
      "#E8E8E8"
    ],
    "finish": "Matte",
    "size": "400x1200mm",
    "use": [
      "Feature Wall",
      "Bedroom"
    ],
    "desc": "Sculptural 3D wave pattern ceramic panels — creates depth and shadow play",
    "image": "imported_tiles_1.jpg",
    "tags": [
      "3D",
      "white",
      "sculptural",
      "modern"
    ]
  },
  {
    "id": "TS019",
    "name": "Geometric Wood Mosaic",
    "category": "Designer",
    "colors": [
      "#8B7355",
      "#DAA520",
      "#A0826D"
    ],
    "finish": "Matte",
    "size": "Custom Mosaic",
    "use": [
      "Feature Wall",
      "Accent"
    ],
    "desc": "Intricate geometric pattern combining wood-look tiles with gold brass inlay",
    "image": "moraccan_3.jpg",
    "tags": [
      "geometric",
      "wood",
      "mosaic",
      "gold"
    ]
  },
  {
    "id": "TS020",
    "name": "Statuario Venato Italian",
    "category": "Imported",
    "colors": [
      "#FAFAFA",
      "#808080",
      "#E8E8E8"
    ],
    "finish": "Polished",
    "size": "600x1200mm",
    "use": [
      "Lobby",
      "Bathroom",
      "Living Room"
    ],
    "desc": "Premium Italian white marble with bold gray veining — imported from Carrara",
    "image": "imported_tiles_1.jpg",
    "tags": [
      "italian",
      "marble",
      "white",
      "premium"
    ]
  },
  {
    "id": "TS021",
    "name": "Spanish Concrete Modern",
    "category": "Imported",
    "colors": [
      "#A8A8A8",
      "#696969",
      "#D3D3D3"
    ],
    "finish": "Matte",
    "size": "600x1200mm",
    "use": [
      "Dining",
      "Living Room"
    ],
    "desc": "Contemporary Spanish porcelain with authentic concrete texture",
    "image": "imported_tiles_2.jpg",
    "tags": [
      "spanish",
      "concrete",
      "modern",
      "porcelain"
    ]
  },
  {
    "id": "TS022",
    "name": "Tuscan Clay Rustic",
    "category": "Imported",
    "colors": [
      "#CD5C5C",
      "#D2691E",
      "#8B4513"
    ],
    "finish": "Matte",
    "size": "300x300mm",
    "use": [
      "Bedroom",
      "Villa"
    ],
    "desc": "Authentic Italian terracotta imported from Tuscany — rustic warmth",
    "image": "imported_tiles_3.jpg",
    "tags": [
      "italian",
      "terracotta",
      "rustic",
      "tuscan"
    ]
  },
  {
    "id": "TS023",
    "name": "Modern Beige Facade",
    "category": "Elevation",
    "colors": [
      "#F5DEB3",
      "#D2B48C",
      "#E8D5C4"
    ],
    "finish": "Matte",
    "size": "600x600mm",
    "use": [
      "Exterior Wall",
      "Facade"
    ],
    "desc": "Contemporary beige elevation tiles — sleek modern architecture",
    "image": "elevation_1.jpg",
    "tags": [
      "beige",
      "modern",
      "facade",
      "exterior"
    ]
  },
  {
    "id": "TS024",
    "name": "Classic Brick Cladding",
    "category": "Elevation",
    "colors": [
      "#CD853F",
      "#8B4513",
      "#D2691E"
    ],
    "finish": "Textured",
    "size": "200x400mm",
    "use": [
      "Exterior Wall",
      "Traditional Homes"
    ],
    "desc": "Traditional brick-look cladding tiles — timeless elevation design",
    "image": "elevation_2.jpg",
    "tags": [
      "brick",
      "traditional",
      "brown",
      "cladding"
    ]
  },
  {
    "id": "TS025",
    "name": "Sandstone Villa Exterior",
    "category": "Elevation",
    "colors": [
      "#F4A460",
      "#DEB887",
      "#D2B48C"
    ],
    "finish": "Textured",
    "size": "400x600mm",
    "use": [
      "Villa Exterior",
      "Elevation"
    ],
    "desc": "Natural sandstone-look tiles for luxury villa facades",
    "image": "elevation_3.jpg",
    "tags": [
      "sandstone",
      "villa",
      "luxury",
      "beige"
    ]
  },
  {
    "id": "TS026",
    "name": "Hexagon Anti-Slip Gray",
    "category": "Parking",
    "colors": [
      "#696969",
      "#A9A9A9",
      "#D3D3D3"
    ],
    "finish": "Anti-Slip",
    "size": "200mm Hexagon",
    "use": [
      "Parking",
      "Outdoor",
      "Driveway"
    ],
    "desc": "Durable hexagon outdoor tiles with anti-slip surface — gray trio pattern",
    "image": "parking_1.jpg",
    "tags": [
      "hexagon",
      "anti-slip",
      "outdoor",
      "gray"
    ]
  },
  {
    "id": "TS027",
    "name": "Garage Floor Diamond",
    "category": "Parking",
    "colors": [
      "#808080",
      "#696969",
      "#C0C0C0"
    ],
    "finish": "Anti-Slip",
    "size": "600x600mm",
    "use": [
      "Garage",
      "Parking"
    ],
    "desc": "Industrial-grade garage flooring with diamond plate pattern — heavy duty",
    "image": "parking_2.jpg",
    "tags": [
      "industrial",
      "anti-slip",
      "garage",
      "heavy-duty"
    ]
  },
  {
    "id": "TS028",
    "name": "Outdoor Patio Granite",
    "category": "Parking",
    "colors": [
      "#708090",
      "#696969",
      "#A9A9A9"
    ],
    "finish": "Textured",
    "size": "600x600mm",
    "use": [
      "Outdoor",
      "Patio",
      "Parking"
    ],
    "desc": "Natural granite-look outdoor tiles — weather resistant",
    "image": "parking_3.jpg",
    "tags": [
      "granite",
      "outdoor",
      "weather-resistant",
      "gray"
    ]
  },
  {
    "id": "TS029",
    "name": "Black Galaxy Premium",
    "category": "Large Slab",
    "colors": [
      "#1C1C1C",
      "#FFD700",
      "#4A4A4A"
    ],
    "finish": "Polished",
    "size": "1200x2400mm",
    "use": [
      "Living Room",
      "Lobby"
    ],
    "desc": "Dramatic black granite-look slab with gold flecks — premium statement flooring",
    "image": "designer_1.jpg",
    "tags": [
      "black",
      "gold",
      "granite",
      "statement"
    ]
  },
  {
    "id": "TS030",
    "name": "Minimalist White Porcelain",
    "category": "Imported",
    "colors": [
      "#FFFFFF",
      "#F8F8F8",
      "#EBEBEB"
    ],
    "finish": "Matte",
    "size": "600x600mm",
    "use": [
      "Office",
      "Commercial",
      "Minimalist"
    ],
    "desc": "Pure white Italian porcelain — minimalist modern architecture",
    "image": "imported_tiles_1.jpg",
    "tags": [
      "white",
      "minimalist",
      "italian",
      "modern"
    ]
  }
];
