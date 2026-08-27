import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Palmtree, Mountain, Wallet, Calendar, FileCheck, Map } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const CHIPS = [
  { id: 'beaches', label: 'Beaches', icon: Palmtree },
  { id: 'mountains', label: 'Mountains', icon: Mountain },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'weekend', label: 'Weekend Trip', icon: Calendar },
  { id: 'visa', label: 'Visa Free', icon: FileCheck },
  { id: 'adventure', label: 'Adventure', icon: Compass }
];

export default function SuggestionChips() {
  const { lightTap } = useHaptics();

  return (
    <div className="w-full overflow-x-auto scrollbar-hide px-6 py-2 pb-3 flex items-center gap-3">
      {CHIPS.map((chip, idx) => (
        <motion.button
          key={chip.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => lightTap()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] backdrop-blur-md shrink-0 transition-colors"
        >
          <chip.icon className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[13px] font-semibold text-white/90 tracking-wide">{chip.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
