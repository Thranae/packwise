import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Image as ImageIcon } from 'lucide-react';

export const Image = ({
  src,
  alt,
  className,
  fallbackSrc = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // If the src is empty or explicitly invalid initially, we can just jump to error state.
  const imageSrc = hasError || !src ? fallbackSrc : src;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Skeleton / Loading State */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-white/10 dark:bg-white/5"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <ImageIcon className="w-1/3 h-1/3 opacity-50" />
          </div>
        </motion.div>
      )}

      {/* Actual Image */}
      <motion.img
        src={imageSrc}
        alt={alt || 'Image'}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setIsLoading(false); // Make sure to stop loading if it errors out
          }
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-700',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        {...props}
      />
    </div>
  );
};
