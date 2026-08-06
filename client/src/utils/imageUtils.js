export const TRAVEL_IMAGES = [
  "https://picsum.photos/seed/1499856871958-5b9627545d1a/1600/900", // Paris / City
  "https://picsum.photos/seed/1476514525535-07fb3b4ae5f1/1600/900", // Mountains / Lake
  "https://picsum.photos/seed/1507525428034-b723cf961d3e/1600/900", // Beach
  "https://picsum.photos/seed/1512453979798-5ea266f8880c/1600/900", // Dubai / Desert / City
  "https://picsum.photos/seed/1493976040374-85c8e12f0c0e/1600/900", // Asia / Temple
  "https://picsum.photos/seed/1469854523086-cc02fe5d8800/1600/900", // Road trip / Van
  "https://picsum.photos/seed/1506929562872-bb421503ef21/1600/900", // Tropical / Ocean
  "https://picsum.photos/seed/1523906834658-6e24ef2386f9/1600/900", // Venice / Europe
];

export const getTripImage = (destination) => {
  if (!destination) return TRAVEL_IMAGES[0];
  
  // Simple hash function to consistently pick an image based on the destination name
  let hash = 0;
  for (let i = 0; i < destination.length; i++) {
    hash = destination.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TRAVEL_IMAGES.length;
  
  return TRAVEL_IMAGES[index];
};
