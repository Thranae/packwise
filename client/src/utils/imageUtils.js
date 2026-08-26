const DESTINATION_IMAGES = {
  'tokyo': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600&auto=format&fit=crop',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1600&auto=format&fit=crop',
  'santorini': 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1600&auto=format&fit=crop',
  'kyoto': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1600&auto=format&fit=crop',
  'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1600&auto=format&fit=crop',
  'cape town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1600&auto=format&fit=crop',
  'swiss': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1600&auto=format&fit=crop',
  'zermatt': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1600&auto=format&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
  'machu picchu': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
  'amalfi': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=1600&auto=format&fit=crop',
  'banff': 'https://images.unsplash.com/photo-1513519107127-1bed33748e4c?q=80&w=1600&auto=format&fit=crop',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1600&auto=format&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop',
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1600&auto=format&fit=crop',
  'iceland': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1600&auto=format&fit=crop',
  'reykjavik': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1600&auto=format&fit=crop',
  'marrakech': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1600&auto=format&fit=crop',
  'morocco': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1600&auto=format&fit=crop',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop',
];

export const getTripImage = (destination) => {
  if (!destination) return FALLBACK_IMAGES[0];

  const lower = destination.toLowerCase();

  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (lower.includes(key)) return url;
  }

  const hash = lower.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
};
