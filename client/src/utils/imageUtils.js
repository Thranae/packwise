export const getTripImage = (destination) => {
  if (!destination) {
    return "https://image.pollinations.ai/prompt/beautiful%20scenic%20travel%20photo%20of%20a%20popular%20travel%20destination?width=1200&height=800&nologo=true";
  }
  
  // Return a generated image from Pollinations AI using the destination name
  // This guarantees we never show a mismatched image (e.g. Pyramids for Lake Tahoe)
  const encodedDest = encodeURIComponent(destination);
  return `https://image.pollinations.ai/prompt/beautiful%20scenic%20travel%20photo%20of%20${encodedDest}?width=1200&height=800&nologo=true`;
};
