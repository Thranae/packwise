import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const FloatingAssistant = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[90]">
      <Link to={ROUTES.ASSISTANT}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[#4D7FFF] rounded-full blur-[10px] opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B8CFF] to-[#4D7FFF] text-white shadow-[0_8px_32px_rgba(91,140,255,0.4)] border border-white/20">
            <Bot className="h-7 w-7" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};
