import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { useAssistant } from '@/context/AssistantContext';

export default function ChatHistory() {
  const { chatMessages } = useAssistant();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  if (chatMessages.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 mt-2 mb-4">
      <AnimatePresence>
        {chatMessages.map((msg, i) => (
          <motion.div
            key={msg.id || i}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`w-full flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`px-4 py-2.5 rounded-[18px] text-[14px] leading-relaxed font-medium ${
                msg.role === 'user' 
                  ? 'bg-blue-600/30 text-white rounded-tr-[4px]' 
                  : 'ios-glass-card text-white/90 rounded-tl-[4px]'
              }`}>
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
