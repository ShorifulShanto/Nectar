
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
    id: 'WA0022',
    index: '01',
    name: 'GUAVA',
    subtitle: 'TROPICAL JUICE',
    description: 'A tropical delight bursting with fresh guava flavor, packed with natural vitamins and a smooth, refreshing taste.',
    color: 'Green',
    hex: '#059669',
    accentHex: '#34D399',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574830/Whisk_8e13f16450d1dbca76a4a21b38cf482edr_mklm4x.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574932/Product_mid-spin_ingredient_2026040622561-ezgif.com-video-to-webp-converter_mkh5o4.webp',
  },
  {
    id: 'WA0023',
    index: '02',
    name: 'APPLE',
    subtitle: 'CRISP JUICE',
    description: 'Refreshing and clean, our apple juice captures the essence of a perfectly ripe orchard harvest with a crisp finish.',
    color: 'Light Green',
    hex: '#65A30D',
    accentHex: '#A3E635',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574830/Whisk_b27f025f2eb6153a39b448db383a25e9dr_donx23.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574941/Product_mid-spin_ingredient_202604062252-ezgif.com-video-to-webp-converter_fvywbo.webp',
  },
  {
    id: 'WA0024',
    index: '03',
    name: 'STRAWBERRY',
    subtitle: 'SWEET YOGURT',
    description: 'A nostalgic journey into summer berry sweetness, balanced perfectly for a modern, creamy palate.',
    color: 'Pink',
    hex: '#DB2777',
    accentHex: '#F472B6',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574831/Whisk_5ded24668f3739d9d09469c17ffb60d7dr_h9mfl6.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574957/Product_mid-spin_ingredient_202604062256-ezgif.com-video-to-webp-converter_ikcrre.webp',
  },
  {
    id: 'WA0025',
    index: '04',
    name: 'CHERRY',
    subtitle: 'CLASSIC JUICE',
    description: 'Bold, deep, and sophisticated. The ultimate cherry experience without the artificial guilt, just pure fruit power.',
    color: 'Deep Red',
    hex: '#9F1239',
    accentHex: '#F43F5E',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574831/Whisk_03bddc76892ae9493a340545afadb486dr_qcfonm.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574964/Product_mid-spin_ingredient_202604062246-ezgif.com-video-to-webp-converter_hltpqk.webp',
  },
  {
    id: 'WA0026',
    index: '05',
    name: 'ORANGE',
    subtitle: 'ZESTY JUICE',
    description: 'Citrus energy refined. A bright, effervescent orange flavor that pops with functional goodness and vitamins.',
    color: 'Orange',
    hex: '#EA580C',
    accentHex: '#FB923C',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574832/Whisk_b43a340c0dfc0ea9b6d461dd4ae11d27dr_mltqzc.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574967/Product_mid-spin_ingredient_202604062257-ezgif.com-video-to-webp-converter_bw7ag2.webp',
  },
  {
    id: 'WA0027',
    index: '06',
    name: 'PINEAPPLE',
    subtitle: 'GOLDEN JUICE',
    description: 'Pure island vibes. The golden sweetness of pineapple meets refreshing functional hydration and natural enzymes.',
    color: 'Yellow',
    hex: '#CA8A04',
    accentHex: '#FACC15',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574832/Whisk_d2a583f9d8507b297ac44fe94a32dfafdr_epwoao.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574976/Product_mid-spin_ingredient_202604062247-ezgif.com-video-to-webp-converter_dadvdu.webp',
  },
  {
    id: 'WA0028',
    index: '07',
    name: 'GRAPE',
    subtitle: 'RICH JUICE',
    description: 'Velvety grape notes with a smooth finish. A premium take on a beloved classic fruit juice flavor.',
    color: 'Purple',
    hex: '#7C3AED',
    accentHex: '#A78BFA',
    imageUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574836/Whisk_5680db65a5a5a4685174bce120d48be3dr_e9wmrf.png',
    videoUrl: 'https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1775574979/Product_mid-spin_ingredient_202604062243-ezgif.com-video-to-webp-converter_zdssjv.webp',
  },
];
