export interface Flavor {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  hex: string;
  accentHex: string;
  videoUrl: string;
  imageUrl: string;
}

export const flavors: Flavor[] = [
  {
    id: '01',
    index: '01',
    name: 'GUAVA',
    subtitle: 'JUICE',
    description: 'A tropical delight bursting with fresh guava flavor, packed with natural vitamins and a smooth, refreshing taste.',
    color: 'Green',
    hex: '#4caf50',
    accentHex: '#81c784',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574830/Whisk_8e13f16450d1dbca76a4a21b38cf482edr_mklm4x.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574932/Product_mid-spin_ingredient_2026040622561-ezgif.com-video-to-webp-converter_mkh5o4.webp',
  },
  {
    id: '02',
    index: '02',
    name: 'GREEN APPLE',
    subtitle: 'JUICE',
    description: 'Refreshing and clean, our apple juice captures the essence of a perfectly ripe orchard harvest with a crisp, tangy finish.',
    color: 'Light Green',
    hex: '#8bc34a',
    accentHex: '#aed581',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574830/Whisk_b27f025f2eb6153a39b448db383a25e9dr_donx23.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574941/Product_mid-spin_ingredient_202604062252-ezgif.com-video-to-webp-converter_fvywbo.webp',
  },
  {
    id: '03',
    index: '03',
    name: 'PINEAPPLE',
    subtitle: 'JUICE',
    description: 'Pure island vibes. The golden sweetness of pineapple meets refreshing functional hydration and natural enzymes.',
    color: 'Yellow',
    hex: '#ffc107',
    accentHex: '#ffd54f',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574832/Whisk_d2a583f9d8507b297ac44fe94a32dfafdr_epwoao.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574976/Product_mid-spin_ingredient_202604062247-ezgif.com-video-to-webp-converter_dadvdu.webp',
  },
  {
    id: '04',
    index: '04',
    name: 'DRAGON FRUIT',
    subtitle: 'JUICE',
    description: 'Bold and beautiful. Dragon fruit\'s subtle sweetness and vivid color make every sip an adventure in flavor.',
    color: 'Pink',
    hex: '#e91e8c',
    accentHex: '#f06292',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574831/Whisk_03bddc76892ae9493a340545afadb486dr_qcfonm.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574964/Product_mid-spin_ingredient_202604062246-ezgif.com-video-to-webp-converter_hltpqk.webp',
  },
  {
    id: '05',
    index: '05',
    name: 'STRAWBERRY YOGURT',
    subtitle: 'SWEET YOGURT',
    description: 'A nostalgic journey into summer berry sweetness, balanced perfectly with a creamy, smooth functional twist.',
    color: 'Red',
    hex: '#f44336',
    accentHex: '#e57373',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574831/Whisk_5ded24668f3739d9d09469c17ffb60d7dr_h9mfl6.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574957/Product_mid-spin_ingredient_202604062256-ezgif.com-video-to-webp-converter_ikcrre.webp',
  },
  {
    id: '06',
    index: '06',
    name: 'GRAPE',
    subtitle: 'RICH JUICE',
    description: 'Velvety grape notes with a smooth, clean finish. A premium take on a beloved classic fruit juice flavor.',
    color: 'Purple',
    hex: '#9c27b0',
    accentHex: '#ba68c8',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574836/Whisk_5680db65a5a5a4685174bce120d48be3dr_e9wmrf.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574979/Product_mid-spin_ingredient_202604062243-ezgif.com-video-to-webp-converter_zdssjv.webp',
  },
  {
    id: '07',
    index: '07',
    name: 'APRICOT',
    subtitle: 'JUICE',
    description: 'Soft, golden, and warmly sweet. Sun-kissed apricots pressed fresh for a velvety juice that feels like summer.',
    color: 'Orange',
    hex: '#ff9800',
    accentHex: '#ffb74d',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574832/Whisk_b43a340c0dfc0ea9b6d461dd4ae11d27dr_mltqzc.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574967/Product_mid-spin_ingredient_202604062257-ezgif.com-video-to-webp-converter_bw7ag2.webp',
  },
];