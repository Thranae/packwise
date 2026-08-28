import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Sparkles, Send } from 'lucide-react';
import { useAssistant, AI_STATES } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';
import { aiService } from '@/services/aiService';

export default function PromptBar() {
  const [voiceState, setVoiceState] = useState('idle');
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addChatMessage, changeAiState, updateRecommendation } = useAssistant();
  const { heavyTap, lightTap } = useHaptics();
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const submitQuery = useCallback(async (text) => {
    if (!text.trim()) return;
    lightTap();
    setIsSubmitting(true);
    addChatMessage('user', text);
    changeAiState(AI_STATES.THINKING);

    try {
      const reply = await aiService.chatAssistant(text, { type: 'travel_assistant' });
      addChatMessage('assistant', reply);
      changeAiState(AI_STATES.IDLE);
    } catch (err) {
      addChatMessage('assistant', 'I had trouble connecting. Please try again.');
      changeAiState(AI_STATES.ERROR);
    } finally {
      setIsSubmitting(false);
      setInputText('');
    }
  }, [addChatMessage, changeAiState, lightTap]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      inputRef.current?.focus();
      return;
    }

    heavyTap();
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => setVoiceState('listening');

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setInputText(transcript);
      if (event.results[0].isFinal) {
        setVoiceState('processing');
        setTimeout(() => {
          submitQuery(transcript);
          setVoiceState('idle');
        }, 300);
      }
    };

    recognition.onerror = () => {
      setVoiceState('idle');
      inputRef.current?.focus();
    };

    recognition.onend = () => {
      if (voiceState === 'listening') setVoiceState('idle');
    };

    recognition.start();
  }, [heavyTap, submitQuery, voiceState]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState('idle');
  }, []);

  const handleMicTap = () => {
    if (voiceState === 'idle') {
      startListening();
    } else {
      stopListening();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitQuery(inputText);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative h-[56px] ios-glass-card rounded-[20px] flex items-center overflow-hidden">
        <div className="flex-1 flex items-center h-full pl-5 pr-1">
          <AnimatePresence mode="wait">
            {voiceState === 'listening' ? (
              <motion.div
                key="waveform"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-[3px] h-5"
              >
                {[1,2,3,4,5,6,7].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.07 }}
                    className="w-[3px] h-full bg-blue-400 rounded-full origin-center"
                  />
                ))}
                <span className="text-xs font-medium text-blue-300 ml-2">Listening...</span>
              </motion.div>
            ) : isSubmitting ? (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-sm font-medium text-white/60">Thinking...</span>
              </motion.div>
            ) : (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your travel assistant..."
                  className="w-full h-full bg-transparent text-sm font-medium text-white/90 placeholder:text-white/30 outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="shrink-0 pr-2 flex items-center gap-1">
          {inputText.trim() && voiceState === 'idle' && !isSubmitting && (
            <button
              onClick={() => submitQuery(inputText)}
              className="w-10 h-10 rounded-full bg-white/[0.1] flex items-center justify-center active:bg-white/20 transition-colors"
            >
              <Send className="w-4 h-4 text-white/70" />
            </button>
          )}
          <button
            onClick={handleMicTap}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              voiceState === 'listening'
                ? 'bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.35)]'
                : 'bg-white/[0.1] text-white/70 active:bg-white/20'
            }`}
          >
            {voiceState === 'listening' ? <X className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
