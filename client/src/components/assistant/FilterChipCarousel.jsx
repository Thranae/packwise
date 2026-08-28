import React, { useRef } from 'react';
import { useAssistant } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';

const CHIPS = ['Beach', 'Luxury', 'Adventure', 'Culture', 'Budget', 'Nature', 'Food', 'Mountains', 'Nightlife'];

export default function FilterChipCarousel() {
  const { activeFilter, setActiveFilter } = useAssistant();
  const { lightTap } = useHaptics();
  const scrollRef = useRef(null);

  const handleChipTap = (chip) => {
    lightTap();
    setActiveFilter(prev => prev === chip ? null : chip);
  };

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 scroll-smooth"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {CHIPS.map((chip) => (
        <button
          key={chip}
          onClick={() => handleChipTap(chip)}
          className={`shrink-0 snap-start py-2.5 px-5 rounded-full transition-all duration-200 ${
            activeFilter === chip
              ? 'ios-liquid-button text-white shadow-[0_4px_12px_rgba(255,255,255,0.15)]'
              : 'ios-glass-card text-white/80 active:bg-white/[0.12]'
          }`}
        >
          <span className="text-[13px] font-semibold tracking-wide whitespace-nowrap">{chip}</span>
        </button>
      ))}
    </div>
  );
}
