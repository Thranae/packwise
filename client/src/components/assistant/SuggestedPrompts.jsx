import React from 'react';
import { useAssistant } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';
import { aiService } from '@/services/aiService';

const PROMPTS = [
  'Best beaches in Southeast Asia',
  'Weekend trip under $500',
  'Solo travel safety tips',
  'Hidden gems in Europe',
  'Best time to visit Japan',
  'Family-friendly destinations',
];

export default function SuggestedPrompts() {
  const { addChatMessage, changeAiState } = useAssistant();
  const { lightTap } = useHaptics();

  const handleTap = async (prompt) => {
    lightTap();
    addChatMessage('user', prompt);
    changeAiState('thinking');
    try {
      const reply = await aiService.chatAssistant(prompt, { type: 'travel_assistant' });
      addChatMessage('assistant', reply);
    } catch {
      addChatMessage('assistant', 'I had trouble connecting. Please try again.');
    }
    changeAiState('idle');
  };

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => handleTap(prompt)}
          className="shrink-0 py-2 px-4 rounded-[12px] ios-glass-card active:bg-white/[0.1] transition-colors"
        >
          <span className="text-[12px] font-medium text-white/50 whitespace-nowrap">{prompt}</span>
        </button>
      ))}
    </div>
  );
}
