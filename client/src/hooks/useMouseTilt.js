import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export const useMouseTilt = (ref, config = { maxTilt: 15, stiffness: 300, damping: 30 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Track raw pixel coordinates for spotlight effects
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: config.stiffness, damping: config.damping };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  // Smooth the spotlight movement as well
  const mouseX = useSpring(rawMouseX, springConfig);
  const mouseY = useSpring(rawMouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [config.maxTilt, -config.maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-config.maxTilt, config.maxTilt]);

  useEffect(() => {
    // Disable spatial 3D effects on touch devices to prevent Chromium flickering bugs on PWA
    const isHoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isHoverable) return;

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      
      const width = rect.width;
      const height = rect.height;
      
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      const xPct = mx / width - 0.5;
      const yPct = my / height - 0.5;
      
      x.set(xPct);
      y.set(yPct);
      rawMouseX.set(mx);
      rawMouseY.set(my);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [ref, x, y, rawMouseX, rawMouseY]);

  return { rotateX, rotateY, mouseX, mouseY };
};
