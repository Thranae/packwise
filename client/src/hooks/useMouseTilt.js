import { useMotionValue } from 'framer-motion';

export const useMouseTilt = () => {
  // Return static motion values of 0 to disable 3D tilt 
  // while keeping compatibility with existing framer-motion components
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  return { rotateX, rotateY, mouseX, mouseY };
};
