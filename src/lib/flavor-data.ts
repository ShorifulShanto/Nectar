
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
}

export const flavors: Flavor[] = [
  {
    id: '01',
    name: 'Guava',
    subtitle: 'Tropical Functional Soda',
    description: 'A vibrant burst of tropical guava that transports you to a sun-drenched paradise with every sip.',
    color: 'Green',
    hex: '#22C55E', // Vibrant Green
    accentHex: '#DCFCE7',
    sequenceId: 'WA0022',
    videoUrl: '',
  },
  {
    id: '02',
    name: 'Apple',
    subtitle: 'Crisp Functional Soda',
    description: 'Refreshing and clean, our apple soda captures the essence of a perfectly ripe orchard harvest.',
    color: 'Light Green',
    hex: '#86EFAC', // Light Green
    accentHex: '#F0FDF4',
    sequenceId: 'WA0023',
    videoUrl: '',
  },
  {
    id: '03',
    name: 'Strawberry',
    subtitle: 'Sweet Functional Soda',
    description: 'A nostalgic journey into summer berry sweetness, balanced perfectly for a modern palate.',
    color: 'Pink',
    hex: '#EC4899', // Pink
    accentHex: '#FCE7F3',
    sequenceId: 'WA0024',
    videoUrl: '',
  },
  {
    id: '04',
    name: 'Cherry',
    subtitle: 'Classic Functional Soda',
    description: 'Bold, deep, and sophisticated. The ultimate cherry experience without the artificial guilt.',
    color: 'Deep Red',
    hex: '#991B1B', // Deep Red
    accentHex: '#FEE2E2',
    sequenceId: 'WA0025',
    videoUrl: '',
  },
  {
    id: '05',
    name: 'Orange',
    subtitle: 'Zesty Functional Soda',
    description: 'Citrus energy refined. A bright, effervescent orange flavor that pops with functional goodness.',
    color: 'Orange',
    hex: '#F97316', // Orange
    accentHex: '#FFEDD5',
    sequenceId: 'WA0026',
    videoUrl: '',
  },
  {
    id: '06',
    name: 'Pineapple',
    subtitle: 'Golden Functional Soda',
    description: 'Pure island vibes. The golden sweetness of pineapple meets refreshing functional hydration.',
    color: 'Yellow',
    hex: '#EAB308', // Yellow
    accentHex: '#FEF9C3',
    sequenceId: 'WA0027',
    videoUrl: '',
  },
  {
    id: '07',
    name: 'Grapes',
    subtitle: 'Rich Functional Soda',
    description: 'Velvety grape notes with a smooth finish. A premium take on a beloved classic soda flavor.',
    color: 'Purple',
    hex: '#8B5CF6', // Purple
    accentHex: '#F5F3FF',
    sequenceId: 'WA0028',
    videoUrl: '',
  },
];
