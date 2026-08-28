import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plane, Building2, Backpack, Wallet, Map, Stamp, Compass, CloudSun } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAssistant } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';
import { aiService } from '@/services/aiService';

export default function QuickActionGrid() {
  const { lightTap, heavyTap } = useHaptics();
  const navigate = useNavigate();
  const { currentRecommendation, addChatMessage, changeAiState } = useAssistant();
  const dest = currentRecommendation?.city || 'your destination';

  const actions = [
    {
      id: 'flights', label: 'Flights', icon: Plane,
      color: 'text-blue-400', bg: 'bg-blue-500/10',
      onTap: () => { lightTap(); navigate(ROUTES.FLIGHTS || '/flights'); }
    },
    {
      id: 'hotels', label: 'Hotels', icon: Building2,
      color: 'text-purple-400', bg: 'bg-purple-500/10',
      onTap: () => {
        lightTap();
        addChatMessage('user', `Find hotels in ${dest}`);
        changeAiState('thinking');
        aiService.chatAssistant(`Find the best hotels in ${dest}`, { type: 'travel_assistant' })
          .then(r => { addChatMessage('assistant', r); changeAiState('idle'); })
          .catch(() => { addChatMessage('assistant', 'Could not search hotels.'); changeAiState('idle'); });
      }
    },
    {
      id: 'packing', label: 'Packing', icon: Backpack,
      color: 'text-emerald-400', bg: 'bg-emerald-500/10',
      onTap: () => { lightTap(); navigate(ROUTES.PACKING || '/packing'); }
    },
    {
      id: 'budget', label: 'Budget', icon: Wallet,
      color: 'text-amber-400', bg: 'bg-amber-500/10',
      onTap: () => { lightTap(); navigate(ROUTES.COST_INTELLIGENCE || '/cost-intelligence'); }
    },
    {
      id: 'maps', label: 'Maps', icon: Map,
      color: 'text-rose-400', bg: 'bg-rose-500/10',
      onTap: () => { lightTap(); navigate(ROUTES.EXPLORE || '/explore'); }
    },
    {
      id: 'visa', label: 'Visa', icon: Stamp,
      color: 'text-indigo-400', bg: 'bg-indigo-500/10',
      onTap: () => {
        lightTap();
        addChatMessage('user', `Visa requirements for ${dest}`);
        changeAiState('thinking');
        aiService.chatAssistant(`What are the visa requirements for traveling to ${dest}?`, { type: 'travel_assistant' })
          .then(r => { addChatMessage('assistant', r); changeAiState('idle'); })
          .catch(() => { addChatMessage('assistant', 'Could not check visa info.'); changeAiState('idle'); });
      }
    },
    {
      id: 'nearby', label: 'Nearby', icon: Compass,
      color: 'text-teal-400', bg: 'bg-teal-500/10',
      onTap: () => { lightTap(); navigate(ROUTES.EXPLORE || '/explore'); }
    },
    {
      id: 'weather', label: 'Weather', icon: CloudSun,
      color: 'text-cyan-400', bg: 'bg-cyan-500/10',
      onTap: () => {
        lightTap();
        addChatMessage('user', `Weather forecast for ${dest}`);
        changeAiState('thinking');
        aiService.chatAssistant(`What's the weather forecast for ${dest}?`, { type: 'travel_assistant' })
          .then(r => { addChatMessage('assistant', r); changeAiState('idle'); })
          .catch(() => { addChatMessage('assistant', 'Could not check weather.'); changeAiState('idle'); });
      }
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22 } } };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-4 gap-2.5 w-full">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            variants={item}
            whileTap={{ scale: 0.92 }}
            onClick={action.onTap}
            className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-[16px] ios-glass-card active:bg-white/[0.07] transition-colors"
          >
            <div className={`w-9 h-9 rounded-[12px] ${action.bg} flex items-center justify-center`}>
              <Icon className={`w-[18px] h-[18px] ${action.color}`} />
            </div>
            <span className="text-[10px] font-semibold text-white/65 leading-none">{action.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
