import { useState, useEffect } from 'react';

export const useImageColor = (imageUrl) => {
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Draw the image and scale it down to 1x1 pixel to get the true average color
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        
        setColor(`rgba(${r}, ${g}, ${b}, 0.5)`); // Return as rgba with 0.5 opacity for a nice glow
      } catch (e) {
        console.error("Could not extract image color", e);
        setColor('rgba(255, 255, 255, 0.1)'); // Fallback
      }
    };

    img.onerror = () => {
      setColor('rgba(255, 255, 255, 0.1)'); // Fallback
    };
  }, [imageUrl]);

  return color;
};
