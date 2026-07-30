import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/animations/variants';
import { cn } from '@/utils/cn';

export const PageTransition = ({ children, className }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
};
