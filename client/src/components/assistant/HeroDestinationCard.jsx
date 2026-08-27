import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { MapPin, CloudSun, Wallet, Clock, Sparkles } from 'lucide-react';
import { useAssistant, REC_STATES } from '@/context/AssistantContext';
import { RecommendationEngine } from '@/services/RecommendationEngine';
import { useDestinationImage } from '@/hooks/useDestinationImage';
import { useHaptics } from '@/hooks/useHaptics';

function GlassStat({ icon: Icon, value, color }) {
  return (
    <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-[14px] bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
      <Icon className={`w-4 h-4 ${color} mb-1 drop-shadow-sm`} />
      <span className="text-[11px] font-semibold text-white/90 leading-none">{value}</span>
    </div>
  );
}

export default function HeroDestinationCard() {
  const { currentRecommendation, changeRecState, updateRecommendation, sessionHistory, userPreferences, setSessionHistory } = useAssistant();
  const { heavyTap, lightTap } = useHaptics();

  const { image } = useDestinationImage(
    currentRecommendation?.city,
    null,
    currentRecommendation?.searchQuery
  );

  const [imgLoaded, setImgLoaded] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-6, 6]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.96, 1, 0.96]);
  const controls = useAnimation();

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => setImgLoaded(true);
    } else {
      setImgLoaded(false);
    }
  }, [image]);

  const handleDragEnd = async (e, info) => {
    if (Math.abs(info.offset.x) > 100) {
      heavyTap();
      changeRecState(REC_STATES.REFRESHING);
      await controls.start({
        x: info.offset.x > 0 ? window.innerWidth : -window.innerWidth,
        opacity: 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
      setSessionHistory(prev => [...prev, currentRecommendation]);
      const nextRec = await RecommendationEngine.generateRecommendation(userPreferences, sessionHistory);
      updateRecommendation(nextRec);
      x.set(0);
      controls.start({ x: 0, opacity: 1 });
    } else {
      lightTap();
      controls.start({ x: 0, opacity: 1 });
    }
  };

  if (!currentRecommendation) return null;

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, scale: cardScale }}
      animate={controls}
      className="relative w-full shrink-0 touch-pan-y will-change-transform transform-gpu px-3"
    >
      <div className="relative w-full h-[340px] rounded-[28px] overflow-hidden bg-[#0A0F1C] border-[0.5px] border-white/[0.15] shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]">

        {/* Image */}
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 bg-white/[0.03] transition-opacity duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a14]/95 via-[#050a14]/30 to-transparent" />
        </div>

        {/* Top: Match badge + Season */}
        <div className="relative z-10 flex justify-between items-start p-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-black/40 backdrop-blur-xl border border-white/[0.1]">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-white text-[11px] font-bold">{currentRecommendation.matchPercent || 98}%</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-[10px] bg-white/[0.08] backdrop-blur-xl border border-white/[0.1]">
            <span className="text-white/90 text-[10px] font-bold uppercase tracking-widest">{currentRecommendation.season}</span>
          </div>
        </div>

        {/* Bottom: Destination info + Glass stats */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5 flex flex-col gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/80">{currentRecommendation.country}</span>
            </div>
            <h2 className="text-[42px] font-extrabold tracking-tight text-white leading-[0.95] drop-shadow-lg">
              {currentRecommendation.city}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <GlassStat icon={CloudSun} value={currentRecommendation.weather} color="text-amber-300" />
            <GlassStat icon={Wallet} value={currentRecommendation.budget} color="text-emerald-400" />
            <GlassStat icon={Clock} value={currentRecommendation.duration} color="text-purple-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
