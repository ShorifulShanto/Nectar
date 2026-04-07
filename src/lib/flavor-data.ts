
export interface Flavor {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  sequenceId: string;
  hex: string;
  videoUrl?: string;
}

export const flavors: Flavor[] = [
  {
    id: '01',
    name: 'Guava',
    subtitle: 'Tropical Functional Soda',
    description: 'A vibrant burst of tropical guava that transports you to a sun-drenched paradise with every sip.',
    color: 'Green',
    hex: '#4ADE80',
    sequenceId: 'WA0022',
    videoUrl: '', // Replace with public cloud URL for WA0022
  },
  {
    id: '02',
    name: 'Apple',
    subtitle: 'Crisp Functional Soda',
    description: 'Refreshing and clean, our apple soda captures the essence of a perfectly ripe orchard harvest.',
    color: 'Light Green',
    hex: '#86EFAC',
    sequenceId: 'WA0023',
    videoUrl: '', // Replace with public cloud URL for WA0023
  },
  {
    id: '03',
    name: 'Strawberry',
    subtitle: 'Sweet Functional Soda',
    description: 'A nostalgic journey into summer berry sweetness, balanced perfectly for a modern palate.',
    color: 'Pink',
    hex: '#F472B6',
    sequenceId: 'WA0024',
    videoUrl: '', // Replace with public cloud URL for WA0024
  },
  {
    id: '04',
    name: 'Cherry',
    subtitle: 'Classic Functional Soda',
    description: 'Bold, deep, and sophisticated. The ultimate cherry experience without the artificial guilt.',
    color: 'Deep Red',
    hex: '#EF4444',
    sequenceId: 'WA0025',
    videoUrl: '', // Replace with public cloud URL for WA0025
  },
  {
    id: '05',
    name: 'Orange',
    subtitle: 'Zesty Functional Soda',
    description: 'Citrus energy refined. A bright, effervescent orange flavor that pops with functional goodness.',
    color: 'Orange',
    hex: '#F97316',
    sequenceId: 'WA0026',
    videoUrl: '', // Replace with public cloud URL for WA0026
  },
  {
    id: '06',
    name: 'Pineapple',
    subtitle: 'Golden Functional Soda',
    description: 'Pure island vibes. The golden sweetness of pineapple meets refreshing functional hydration.',
    color: 'Yellow',
    hex: '#FACC15',
    sequenceId: 'WA0027',
    videoUrl: '', // Replace with public cloud URL for WA0027
  },
  {
    id: '07',
    name: 'Grapes',
    subtitle: 'Rich Functional Soda',
    description: 'Velvety grape notes with a smooth finish. A premium take on a beloved classic soda flavor.',
    color: 'Purple',
    hex: '#A855F7',
    sequenceId: 'WA0028',
    videoUrl: '', // Replace with public cloud URL for WA0028
  },
];
