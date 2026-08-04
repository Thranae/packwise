export const TRAVEL_IMAGES = [
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop", // Paris / City
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop", // Mountains / Lake
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop", // Beach
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop", // Dubai / Desert / City
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop", // Asia / Temple
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop", // Road trip / Van
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1600&auto=format&fit=crop", // Tropical / Ocean
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1600&auto=format&fit=crop", // Venice / Europe
];

export const getTripImage = (destination) => {
  if (!destination) return "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop";
  return `https://image.pollinations.ai/prompt/beautiful%20scenic%20travel%20photo%20of%20${encodeURIComponent(destination)}?width=1200&height=800&nologo=true`;
};
