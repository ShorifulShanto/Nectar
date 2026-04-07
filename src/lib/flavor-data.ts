
export interface Flavor {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  hex: string;
  accentHex: string;
  videoUrl: string;
  imageUrl: string;
}

// Base URL for Cloudinary assets
const CLOUDINARY_BASE = 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto';

export const flavors: Flavor[] = [
  {
    id: 'WA0022',
    name: 'Guava',
    subtitle: 'Tropical Functional Soda',
    description: 'A vibrant burst of tropical guava that transports you to a sun-drenched paradise with every sip.',
    color: 'Green',
    hex: '#059669',
    accentHex: '#34D399',
    imageUrl: `${CLOUDINARY_BASE}/guava.png`,
    videoUrl: `${CLOUDINARY_BASE}/guava_webp.webp`,
  },
  {
    id: 'WA0023',
    name: 'Apple',
    subtitle: 'Crisp Functional Soda',
    description: 'Refreshing and clean, our apple soda captures the essence of a perfectly ripe orchard harvest.',
    color: 'Light Green',
    hex: '#65A30D',
    accentHex: '#A3E635',
    imageUrl: `${CLOUDINARY_BASE}/apple.png`,
    videoUrl: `${CLOUDINARY_BASE}/apple_webp.webp`,
  },
  {
    id: 'WA0024',
    name: 'Strawberry',
    subtitle: 'Sweet Functional Soda',
    description: 'A nostalgic journey into summer berry sweetness, balanced perfectly for a modern palate.',
    color: 'Pink',
    hex: '#DB2777',
    accentHex: '#F472B6',
    imageUrl: `${CLOUDINARY_BASE}/strawberry.png`,
    videoUrl: `${CLOUDINARY_BASE}/strawberry_webp.webp`,
  },
  {
    id: 'WA0025',
    name: 'Cherry',
    subtitle: 'Classic Functional Soda',
    description: 'Bold, deep, and sophisticated. The ultimate cherry experience without the artificial guilt.',
    color: 'Deep Red',
    hex: '#9F1239',
    accentHex: '#F43F5E',
    imageUrl: `${CLOUDINARY_BASE}/cherry.png`,
    videoUrl: `${CLOUDINARY_BASE}/cherry_webp.webp`,
  },
  {
    id: 'WA0026',
    name: 'Orange',
    subtitle: 'Zesty Functional Soda',
    description: 'Citrus energy refined. A bright, effervescent orange flavor that pops with functional goodness.',
    color: 'Orange',
    hex: '#EA580C',
    accentHex: '#FB923C',
    imageUrl: `${CLOUDINARY_BASE}/orange.png`,
    videoUrl: `${CLOUDINARY_BASE}/orange_webp.webp`,
  },
  {
    id: 'WA0027',
    name: 'Pineapple',
    subtitle: 'Golden Functional Soda',
    description: 'Pure island vibes. The golden sweetness of pineapple meets refreshing functional hydration.',
    color: 'Yellow',
    hex: '#CA8A04',
    accentHex: '#FACC15',
    imageUrl: `${CLOUDINARY_BASE}/pineapple.png`,
    videoUrl: `${CLOUDINARY_BASE}/pineapple_webp.webp`,
  },
  {
    id: 'WA0028',
    name: 'Grapes',
    subtitle: 'Rich Functional Soda',
    description: 'Velvety grape notes with a smooth finish. A premium take on a beloved classic soda flavor.',
    color: 'Purple',
    hex: '#7C3AED',
    accentHex: '#A78BFA',
    imageUrl: `${CLOUDINARY_BASE}/grapes.png`,
    videoUrl: `${CLOUDINARY_BASE}/grapes_webp.webp`,
  },
];
