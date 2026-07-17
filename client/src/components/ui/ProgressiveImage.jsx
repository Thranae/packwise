import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export const ProgressiveImage = ({ 
  src, 
  alt, 
  className,
  containerClassName,
  delay = 0 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-white/5", containerClassName)}>
      {/* Skeleton / Placeholder state */}
      <motion.div 
        animate={isLoaded ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"
      />
      
      {src && (
        <motion.img
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: isLoaded ? 1 : 0, filter: isLoaded ? 'blur(0px)' : 'blur(10px)' }}
          transition={{ duration: 0.5, delay }}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)} // Show anyway if error
          onLoadStart={(e) => { if(e.target.complete) setIsLoaded(true); }}
          className={cn("w-full h-full object-cover transition-transform duration-700", className)}
        />
      )}
    </div>
  );
};
