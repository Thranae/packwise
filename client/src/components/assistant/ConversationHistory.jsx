import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const CHATS = [
  { id: 1, text: "Romantic getaways in Europe under $2000", time: "2h ago" },
  { id: 2, text: "What's the weather like in Tokyo in March?", time: "Yesterday" }
];

export default function ConversationHistory() {
  const { lightTap } = useHaptics();

  return (
    <div className="w-full px-4 sm:px-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Chats</h3>
        <button className="text-xs font-semibold text-white/50 active:text-white/80 transition-colors">View All</button>
      </div>

      <div className="flex flex-col gap-3">
        {CHATS.map((chat) => (
          <button
            key={chat.id}
            onClick={() => lightTap()}
            className="w-full p-4 rounded-[20px] bg-white/[0.03] backdrop-blur-md border border-white/10 active:bg-white/[0.06] transition-all duration-200 text-left flex items-start justify-between group"
          >
            <div className="flex items-start gap-3 flex-1 pr-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4 text-white/60" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white/90 line-clamp-2 leading-relaxed">{chat.text}</span>
                <span className="text-[10px] text-white/40 font-semibold">{chat.time}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-active:text-white/90 shrink-0 mt-2 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
