
export interface Flavor {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  sequenceId: string;
  hex: string;
  accentHex: string;
  videoUrl?: string;
  imageUrl?: string;
}

export const flavors: Flavor[] = [
  {
    id: '01',
    name: 'Guava',
    subtitle: 'Tropical Functional Soda',
    description: 'A vibrant burst of tropical guava that transports you to a sun-drenched paradise with every sip.',
    color: 'Green',
    hex: '#059669', // Emerald 600
    accentHex: '#34D399', // Emerald 400
    sequenceId: 'WA0022',
    videoUrl: '', // CLOUDINARY_WEBP_URL_HERE
    imageUrl: '', // CLOUDINARY_IMAGE_URL_HERE
  },
  {
    id: '02',
    name: 'Apple',
    subtitle: 'Crisp Functional Soda',
    description: 'Refreshing and clean, our apple soda captures the essence of a perfectly ripe orchard harvest.',
    color: 'Light Green',
    hex: '#65A30D', // Lime 600
    accentHex: '#A3E635', // Lime 400
    sequenceId: 'WA0023',
    videoUrl: '', 
    imageUrl: '', 
  },
  {
    id: '03',
    name: 'Strawberry',
    subtitle: 'Sweet Functional Soda',
    description: 'A nostalgic journey into summer berry sweetness, balanced perfectly for a modern palate.',
    color: 'Pink',
    hex: '#DB2777', // Pink 600
    accentHex: '#F472B6', // Pink 400
    sequenceId: 'WA0024',
    videoUrl: '',
    imageUrl: '',
  },
  {
    id: '04',
    name: 'Cherry',
    subtitle: 'Classic Functional Soda',
    description: 'Bold, deep, and sophisticated. The ultimate cherry experience without the artificial guilt.',
    color: 'Deep Red',
    hex: '#9F1239', // Rose 800
    accentHex: '#F43F5E', // Rose 500
    sequenceId: 'WA0025',
    videoUrl: '',
    imageUrl: '',
  },
  {
    id: '05',
    name: 'Orange',
    subtitle: 'Zesty Functional Soda',
    description: 'Citrus energy refined. A bright, effervescent orange flavor that pops with functional goodness.',
    color: 'Orange',
    hex: '#EA580C', // Orange 600
    accentHex: '#FB923C', // Orange 400
    sequenceId: 'WA0026',
    videoUrl: '',
    imageUrl: '',
  },
  {
    id: '06',
    name: 'Pineapple',
    subtitle: 'Golden Functional Soda',
    description: 'Pure island vibes. The golden sweetness of pineapple meets refreshing functional hydration.',
    color: 'Yellow',
    hex: '#CA8A04', // Yellow 600
    accentHex: '#FACC15', // Yellow 400
    sequenceId: 'WA0027',
    videoUrl: '',
    imageUrl: '',
  },
  {
    id: '07',
    name: 'Grapes',
    subtitle: 'Rich Functional Soda',
    description: 'Velvety grape notes with a smooth finish. A premium take on a beloved classic soda flavor.',
    color: 'Purple',
    hex: '#7C3AED', // Violet 600
    accentHex: '#A78BFA', // Violet 400
    sequenceId: 'WA0028',
    videoUrl: '',
    imageUrl: '',
  },
];
