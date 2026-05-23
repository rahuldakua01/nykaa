const PRODUCTS = [
  {
    id: "makeup-lip-1",
    name: "Retro Matte Lipstick",
    brand: "MAC",
    category: "makeup",
    subcategory: "lips",
    price: 1950,
    mrp: 2300,
    discount: 15,
    rating: 4.8,
    reviewsCount: 1420,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [
      { name: "Ruby Woo", colorCode: "#b30b21" },
      { name: "Velvet Teddy", colorCode: "#ac766b" },
      { name: "Mehr", colorCode: "#b15d71" },
      { name: "Chili", colorCode: "#9d311b" }
    ],
    sizes: [],
    tags: ["Best Seller", "Matte Finish"],
    description: "MAC Retro Matte Lipstick is the iconic product that made M·A·C famous. This long-wearing formula features an intense color payoff and a completely matte finish. Boasting 12-hour wear, it stays on comfortably without feathering.",
    reviews: [
      { user: "Sneha Patel", rating: 5, date: "2026-05-18", comment: "Ruby Woo is the absolute best red lipstick ever created! Suits every skin tone." },
      { user: "Aisha R.", rating: 4, date: "2026-05-14", comment: "Velvet Teddy is a lovely everyday nude shade. A bit drying, so prep lips first." },
      { user: "Pooja Hegde", rating: 5, date: "2026-04-29", comment: "Long lasting and extremely pigmented. Highly recommended!" }
    ]
  },
  {
    id: "makeup-lip-2",
    name: "SuperStay Matte Ink Liquid Lipstick",
    brand: "Maybelline New York",
    category: "makeup",
    subcategory: "lips",
    price: 599,
    mrp: 699,
    discount: 14,
    rating: 4.5,
    reviewsCount: 3290,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [
      { name: "Seductress", colorCode: "#c4887f" },
      { name: "Pioneer", colorCode: "#8b0e17" },
      { name: "Lover", colorCode: "#ad6174" },
      { name: "Voyager", colorCode: "#4e0d1b" }
    ],
    sizes: [],
    tags: ["Trending", "Transfer-proof"],
    description: "Ink your lips in up to 16 HR saturated liquid matte. Maybelline SuperStay Matte Ink™ features a unique arrow applicator for precise application. This transfer-proof liquid lipstick lasts all day with no touch-ups needed.",
    reviews: [
      { user: "Ridhi M.", rating: 5, date: "2026-05-20", comment: "This is literal cement for lips in the best way possible! Does not budge even after oily meals." },
      { user: "Tanya Sen", rating: 4, date: "2026-05-02", comment: "Very transfer proof but hard to remove. Needs an oil-based makeup remover." }
    ]
  },
  {
    id: "makeup-face-1",
    name: "Fit Me Matte + Poreless Liquid Foundation",
    brand: "Maybelline New York",
    category: "makeup",
    subcategory: "face",
    price: 549,
    mrp: 649,
    discount: 15,
    rating: 4.4,
    reviewsCount: 4890,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608979087030-1a1ab4d262c1?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [
      { name: "128 Warm Nude", colorCode: "#e7c3a2" },
      { name: "220 Natural Beige", colorCode: "#dfb08c" },
      { name: "310 Sun Beige", colorCode: "#d39c73" },
      { name: "330 Toffee", colorCode: "#be8154" }
    ],
    sizes: [],
    tags: ["Best Seller", "Matte Finish"],
    description: "Maybelline Fit Me Matte + Poreless Foundation hydrates and refines pores for a naturally matte finish. Perfect for normal to oily skin, this lightweight foundation features micro-powders to control shine and blur pores.",
    reviews: [
      { user: "Neha K.", rating: 5, date: "2026-05-11", comment: "My holy grail foundation! Shade 220 matches my warm undertones perfectly. Light and comfortable." }
    ]
  },
  {
    id: "makeup-face-2",
    name: "Studio Fix Powder Plus Foundation",
    brand: "MAC",
    category: "makeup",
    subcategory: "face",
    price: 3300,
    mrp: 3600,
    discount: 8,
    rating: 4.7,
    reviewsCount: 920,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [
      { name: "NC20", colorCode: "#e8cfb5" },
      { name: "NC35", colorCode: "#d9b691" },
      { name: "NC40", colorCode: "#cc9f74" },
      { name: "NC45", colorCode: "#b17e54" }
    ],
    sizes: [],
    tags: ["Luxe", "Dual Action"],
    description: "A one-step powder and foundation that gives skin a smooth, flawless, all-matte finish with medium-to-full coverage and a velvety texture that allows skin to breathe. Long-wearing, color-true, non-caking, and non-settling.",
    reviews: [
      { user: "Preeti V.", rating: 5, date: "2026-05-05", comment: "NC40 is my perfect shade. Gives full coverage in just one sweep. Best powder foundation!" }
    ]
  },
  {
    id: "makeup-eyes-1",
    name: "Eyeconic Liquid Kajal - Deep Black",
    brand: "Lakme",
    category: "makeup",
    subcategory: "eyes",
    price: 249,
    mrp: 299,
    discount: 16,
    rating: 4.3,
    reviewsCount: 1980,
    images: [
      "https://images.unsplash.com/photo-1631214503851-a0197d90c445?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [],
    tags: ["Waterproof", "Daily Wear"],
    description: "Lakme Eyeconic Kajal is a smudge-proof, waterproof kajal that lasts up to 22 hours. Formulated with key nutrients and vitamins, it delivers a deep black finish with a single swipe, elevating your eye makeup routine.",
    reviews: [
      { user: "Divya G.", rating: 4, date: "2026-05-19", comment: "Does not smudge at all on my oily eyelids. Love the intense pigmentation!" }
    ]
  },
  {
    id: "makeup-eyes-2",
    name: "Lash Paradise Mascara - Black",
    brand: "L'Oreal Paris",
    category: "makeup",
    subcategory: "eyes",
    price: 799,
    mrp: 999,
    discount: 20,
    rating: 4.6,
    reviewsCount: 2240,
    images: [
      "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [],
    tags: ["Trending", "Volumizing"],
    description: "L'Oreal Paris Voluminous Lash Paradise Mascara delivers voluptuous volume and intense length. The soft wavy bristle brush holds maximum formula, coating lashes evenly while feeling soft as feather.",
    reviews: [
      { user: "Meera D.", rating: 5, date: "2026-05-09", comment: "Better than high-end luxury mascaras! Separates lashes beautifully and adds insane volume." }
    ]
  },
  {
    id: "makeup-nail-1",
    name: "Nail Lacquer - Sugar Syrup Collection",
    brand: "Nykaa Cosmetics",
    category: "makeup",
    subcategory: "nails",
    price: 199,
    mrp: 225,
    discount: 11,
    rating: 4.2,
    reviewsCount: 880,
    images: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [
      { name: "Marshmallow Crush", colorCode: "#f3e1ec" },
      { name: "Peach Crumble", colorCode: "#e7ab9b" },
      { name: "Plum Pudding", colorCode: "#85566f" }
    ],
    sizes: [],
    tags: ["Cruelty-free", "Glossy Finish"],
    description: "Get glossy salon-like nails in a single stroke with Nykaa Sugar Syrup Nail Lacquers. Highly pigmented, long-lasting, and chip-resistant, these nail polishes deliver rich color with an ultra-glossy jelly finish.",
    reviews: [
      { user: "Kirat K.", rating: 5, date: "2026-05-03", comment: "Love the marshmallow shade, it's the perfect sheer clean-girl aesthetic nail polish." }
    ]
  },
  {
    id: "skin-cleanse-1",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "skin",
    subcategory: "cleanser",
    price: 1250,
    mrp: 1450,
    discount: 13,
    rating: 4.8,
    reviewsCount: 2150,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "236 ml", price: 1250, mrp: 1450 },
      { name: "473 ml", price: 2100, mrp: 2400 }
    ],
    tags: ["Dermatologist Approved", "Gentle"],
    description: "CeraVe Hydrating Cleanser was designed to cleanse and refresh the skin without over-stripping it or leaving it feeling tight and dry. Featuring three essential ceramides and hyaluronic acid to restore the skin barrier.",
    reviews: [
      { user: "Rohit Verma", rating: 5, date: "2026-05-15", comment: "Best cleanser for dry and sensitive skin. It doesn't foam, but leaves skin feeling so plump and clean." }
    ]
  },
  {
    id: "skin-serum-1",
    name: "Niacinamide 10% Serum with Zinc",
    brand: "Minimalist",
    category: "skin",
    subcategory: "serum",
    price: 599,
    mrp: 699,
    discount: 14,
    rating: 4.6,
    reviewsCount: 3740,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "30 ml", price: 599, mrp: 699 },
      { name: "50 ml", price: 899, mrp: 999 }
    ],
    tags: ["Best Seller", "Acne-care"],
    description: "A nourishing daily serum packed with pure 10% Niacinamide and Zinc PCA. It effectively reduces acne marks, controls excess sebum production, strengthens the skin barrier, and improves overall skin texture.",
    reviews: [
      { user: "Priya Nair", rating: 5, date: "2026-05-12", comment: "My acne scars faded in literally 3 weeks. I use it twice a day, absolute holy grail!" },
      { user: "Karan Johar", rating: 4, date: "2026-04-20", comment: "Good serum, controls oiliness well, but make sure to patch test first." }
    ]
  },
  {
    id: "skin-serum-2",
    name: "Hyaluronic Acid 2% + B5 Serum",
    brand: "The Ordinary",
    category: "skin",
    subcategory: "serum",
    price: 750,
    mrp: 850,
    discount: 11,
    rating: 4.7,
    reviewsCount: 2980,
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "30 ml", price: 750, mrp: 850 },
      { name: "60 ml", price: 1350, mrp: 1500 }
    ],
    tags: ["Hydration Boost", "Luxe"],
    description: "A hydration-support formula with ultra-pure, vegan hyaluronic acid. This formulation combines low-, medium- and high-molecular-weight HA, as well as a next-generation HA crosspolymer, to support multi-depth hydration.",
    reviews: [
      { user: "Nancy D.", rating: 5, date: "2026-05-17", comment: "Amazing hydration! Pat it on damp skin, follow up with moisturizer. My skin feels like glass." }
    ]
  },
  {
    id: "skin-moisturizer-1",
    name: "Moisture Surge 100H Auto-Replenishing Hydrator",
    brand: "Clinique",
    category: "skin",
    subcategory: "moisturizer",
    price: 3200,
    mrp: 3500,
    discount: 8,
    rating: 4.8,
    reviewsCount: 1120,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "30 ml", price: 1950, mrp: 2100 },
      { name: "50 ml", price: 3200, mrp: 3500 }
    ],
    tags: ["Luxe", "Oil-Free"],
    description: "An oil-free gel-cream moisturizer with exclusive aloe bio-ferment and hyaluronic acid that penetrates deep into skin's surface—for hydration that lasts over 100 hours, even after washing your face.",
    reviews: [
      { user: "Dr. Shreya", rating: 5, date: "2026-05-14", comment: "Feels like water but moisturizes like butter. Zero greasiness, perfect base for makeup." }
    ]
  },
  {
    id: "skin-moisturizer-2",
    name: "Soundarya Ultra-Rich Radiant Beauty Elixir",
    brand: "Forest Essentials",
    category: "skin",
    subcategory: "moisturizer",
    price: 4950,
    mrp: 5200,
    discount: 4,
    rating: 4.9,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [],
    tags: ["Luxe", "Ayurvedic"],
    description: "An award-winning facial serum that incorporates 24 Karat Gold Bhasma. It acts as an exceptionally rich fluid that helps in skin tightening, restoring natural elasticity, and giving the skin an immediate gold-like glow.",
    reviews: [
      { user: "Kriti S.", rating: 5, date: "2026-05-08", comment: "Pure luxury. Smells heavenly like real sandalwood and jasmine. Worth every single penny!" }
    ]
  },
  {
    id: "skin-sunscreen-1",
    name: "Ultra Sheer Dry-Touch Sunblock SPF 50+",
    brand: "Neutrogena",
    category: "skin",
    subcategory: "sunscreen",
    price: 649,
    mrp: 750,
    discount: 13,
    rating: 4.3,
    reviewsCount: 3100,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "30 ml", price: 320, mrp: 380 },
      { name: "88 ml", price: 649, mrp: 750 }
    ],
    tags: ["Water-resistant", "Dermatologist Approved"],
    description: "Neutrogena Ultra Sheer Dry-Touch Sunblock SPF 50+ is a breakthrough in sun protection. Formulated with Helioplex technology, it provides superior broad-spectrum protection against skin-aging UVA and burning UVB rays.",
    reviews: [
      { user: "Devika", rating: 4, date: "2026-05-18", comment: "Good protection, dry touch as claimed, but leaves a slight white cast on dark skin if not blended well." }
    ]
  },
  {
    id: "hair-shampoo-1",
    name: "No.4 Bond Maintenance Shampoo",
    brand: "Olaplex",
    category: "hair",
    subcategory: "shampoo",
    price: 2950,
    mrp: 3200,
    discount: 7,
    rating: 4.8,
    reviewsCount: 1540,
    images: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [],
    tags: ["Luxe", "Damage Repair"],
    description: "A highly moisturizing, reparative shampoo that leaves hair easy to manage, shiny, and healthier with each use. Olaplex No.4 repairs and protects hair from everyday stresses—including damaged hair, split ends, and frizz—by re-linking broken bonds.",
    reviews: [
      { user: "Simran G.", rating: 5, date: "2026-05-16", comment: "Literally saved my bleached blonde hair. Zero hair fall and leaves hair feeling extremely strong." }
    ]
  },
  {
    id: "hair-shampoo-2",
    name: "Absolut Repair Shampoo with Wheat Protein",
    brand: "L'Oreal Professionnel",
    category: "hair",
    subcategory: "shampoo",
    price: 899,
    mrp: 999,
    discount: 10,
    rating: 4.6,
    reviewsCount: 2010,
    images: [
      "https://images.unsplash.com/photo-1519735797-402a7b8e553a?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "300 ml", price: 899, mrp: 999 },
      { name: "500 ml", price: 1399, mrp: 1590 }
    ],
    tags: ["Saloon Recommendation", "Anti-frizz"],
    description: "L'Oreal Professionnel Absolut Repair Shampoo offers the ultimate professional resurfacing experience for damaged hair. It restructures dry, damaged hair fibers from within, leaving hair shiny, smooth, and lightweight.",
    reviews: [
      { user: "Pallavi B.", rating: 5, date: "2026-05-12", comment: "Highly recommend for chemically treated hair. It tamed my frizz in just one wash!" }
    ]
  },
  {
    id: "hair-mask-1",
    name: "No.3 Hair Perfector Treatment",
    brand: "Olaplex",
    category: "hair",
    subcategory: "hair-treatment",
    price: 2950,
    mrp: 3200,
    discount: 7,
    rating: 4.7,
    reviewsCount: 1860,
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [],
    tags: ["Luxe", "Best Seller"],
    description: "Not a conditioner, Olaplex No. 3 is an at-home bond-building treatment containing the same active ingredient found in all professional Olaplex salon products. It rebuilds broken disulfide bonds in the hair, improving look and texture.",
    reviews: [
      { user: "Harsimran", rating: 5, date: "2026-05-04", comment: "Worth every rupee. Keep it on damp hair for 30 minutes before shampooing. Magic in a bottle!" }
    ]
  },
  {
    id: "fragrance-perfume-1",
    name: "Sauvage Eau De Parfum",
    brand: "Dior",
    category: "fragrance",
    subcategory: "perfume",
    price: 9900,
    mrp: 11500,
    discount: 13,
    rating: 4.9,
    reviewsCount: 840,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "60 ml", price: 7900, mrp: 9000 },
      { name: "100 ml", price: 9900, mrp: 11500 }
    ],
    tags: ["Luxe", "Long-lasting"],
    description: "The powerful freshness of Sauvage exudes new sensual and mysterious facets, amply renewing itself with the signature of an ingenious composition. Calabrian bergamot, spirited and juicy, invites new spicy notes to add fullness and sensuality.",
    reviews: [
      { user: "Aditya Roy", rating: 5, date: "2026-05-19", comment: "The projection is incredible! Lasts over 12 hours on skin and days on clothes. The ultimate compliment getter." }
    ]
  },
  {
    id: "fragrance-perfume-2",
    name: "Bright Crystal Eau De Toilette",
    brand: "Versace",
    category: "fragrance",
    subcategory: "perfume",
    price: 7200,
    mrp: 8000,
    discount: 10,
    rating: 4.7,
    reviewsCount: 650,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [
      { name: "50 ml", price: 5600, mrp: 6200 },
      { name: "90 ml", price: 7200, mrp: 8000 }
    ],
    tags: ["Luxe", "Floral Notes"],
    description: "Inspired by a mixture of Donatella Versace's favorite floral fragrances, Bright Crystal is a fresh, sensual blend of refreshing chilled yuzu and pomegranate mingled with soothing blossoms of peony, magnolia, and lotus flower.",
    reviews: [
      { user: "Anjali K.", rating: 5, date: "2026-05-15", comment: "Very fresh, clean, and floral. Perfect for summer and office wear. Bottle is absolutely gorgeous!" }
    ]
  },
  {
    id: "personal-mist-1",
    name: "Wanderlust Body Mist - Hawaiian Rhapsody",
    brand: "Nykaa Wanderlust",
    category: "fragrance",
    subcategory: "body-mist",
    price: 350,
    mrp: 500,
    discount: 30,
    rating: 4.4,
    reviewsCount: 1650,
    images: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [],
    tags: ["Trending", "Summer Vibe"],
    description: "Nykaa Wanderlust Body Mist Hawaiian Rhapsody lets you dive into a tropical paradise. Centered around sweet frangipani and refreshing coconut water, this mist sweeps you away to volcanic beaches and warm tropical breezes.",
    reviews: [
      { user: "Kashish G.", rating: 4, date: "2026-05-07", comment: "Smells like a tropical vacation. Sweet coconut and floral notes. Very light and refreshing, perfect for post-shower wear." }
    ]
  },
  {
    id: "personal-bath-1",
    name: "Warm Vanilla Sugar Fine Fragrance Mist",
    brand: "Bath & Body Works",
    category: "fragrance",
    subcategory: "body-mist",
    price: 1399,
    mrp: 1799,
    discount: 22,
    rating: 4.6,
    reviewsCount: 1980,
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80"
    ],
    shades: [],
    sizes: [],
    tags: ["Sweet Scent", "Imported"],
    description: "Bath & Body Works Warm Vanilla Sugar Fine Fragrance Mist features a cozy, enveloping, sweet blend of vanilla, white orchid, sparkling sugar, fresh jasmine, and creamy sandalwood. Conditioning aloe mist nourishes skin for a light, refreshing scent.",
    reviews: [
      { user: "Shruti Sinha", rating: 5, date: "2026-05-13", comment: "If you want to smell like a walking fresh-baked vanilla cupcake, buy this immediately! My absolute favorite scent." }
    ]
  }
];
