import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripContext } from '@/context/TripContext';
import { Book, Plus, Image as ImageIcon, MapPin, Calendar as CalendarIcon, Smile, Sun, Cloud, CloudRain, Snowflake, Wind, Coffee, Heart, Camera, ChevronDown, Check, X, Clock, Send, Sparkles, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useToast } from '@/hooks/useToast';

const MOODS = [
  { id: 'happy', icon: Smile, label: 'Happy', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  { id: 'loved', icon: Heart, label: 'Loved', color: 'text-pink-400', bg: 'bg-pink-400/20' },
  { id: 'relaxed', icon: Coffee, label: 'Relaxed', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { id: 'excited', icon: Camera, label: 'Excited', color: 'text-blue-400', bg: 'bg-blue-400/20' },
];

const WEATHER = [
  { id: 'sunny', icon: Sun, label: 'Sunny', color: 'text-orange-400', bg: 'bg-orange-400/20' },
  { id: 'cloudy', icon: Cloud, label: 'Cloudy', color: 'text-gray-400', bg: 'bg-gray-400/20' },
  { id: 'rainy', icon: CloudRain, label: 'Rainy', color: 'text-blue-400', bg: 'bg-blue-400/20' },
  { id: 'snowy', icon: Snowflake, label: 'Snowy', color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
  { id: 'windy', icon: Wind, label: 'Windy', color: 'text-teal-400', bg: 'bg-teal-400/20' },
];

const MOCK_ENTRIES = [
  {
    id: 1,
    date: new Date().toISOString(),
    location: 'Downtown',
    content: 'Arrived and checked in to the hotel. The view from the balcony is absolutely breathtaking. Spent the afternoon wandering the streets and found a hidden cafe.',
    mood: 'excited',
    weather: 'sunny',
    image: null
  }
];

// Helper to provide independent tilt for feed cards
function FeedCard({ entry }) {
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 2, stiffness: 200, damping: 30 });
  const d = new Date(entry.date);
  const moodDef = MOODS.find(m => m.id === entry.mood) || MOODS[0];
  const weatherDef = WEATHER.find(w => w.id === entry.weather) || WEATHER[0];
  const MoodIcon = moodDef.icon;
  const WeatherIcon = weatherDef.icon;

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative rounded-[32px] overflow-hidden bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.4)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2)] hover:border-white/20"
    >

      {/* Photo Hero (if any) */}
      {entry.image && (
        <div className="w-full h-[250px] sm:h-[400px] overflow-hidden relative border-b border-white/10" style={{ transform: "translateZ(20px)" }}>
          <img src={entry.image} alt="Journal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A101C] via-[#0A101C]/40 to-transparent" />
          
          <div className="absolute top-5 right-5 flex gap-2">
            <div className={`px-4 py-2 rounded-2xl ${moodDef.bg} ${moodDef.color} text-xs font-bold flex items-center gap-2 backdrop-blur-xl shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-white/20`}>
              <MoodIcon className="w-4 h-4 drop-shadow-md" />
              {moodDef.label}
            </div>
            <div className={`px-4 py-2 rounded-2xl ${weatherDef.bg} ${weatherDef.color} text-xs font-bold flex items-center gap-2 backdrop-blur-xl shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-white/20`}>
              <WeatherIcon className="w-4 h-4 drop-shadow-md" />
              {weatherDef.label}
            </div>
          </div>
        </div>
      )}

      {/* Text Content */}
      <div className="relative p-6 md:p-8" style={{ transform: "translateZ(30px)" }}>
        
        {/* Header Context (if no image) */}
        {!entry.image && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${moodDef.bg} ${moodDef.color} flex items-center justify-center border border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)]`}>
                <MoodIcon className="w-6 h-6 drop-shadow-lg" />
              </div>
              <div className={`w-12 h-12 rounded-2xl ${weatherDef.bg} ${weatherDef.color} flex items-center justify-center border border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)]`}>
                <WeatherIcon className="w-6 h-6 drop-shadow-lg" />
              </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] text-sm font-semibold border border-white/20">
              <MapPin className="w-4 h-4 text-pink-400 drop-shadow-md" />
              {entry.location}
            </div>
          </div>
        )}
        
        {/* Location Badge for Image version */}
        {entry.image && (
          <div className="flex items-center gap-2 mb-6 text-white text-sm font-semibold">
            <MapPin className="w-5 h-5 text-pink-400 drop-shadow-lg" />
            <span className="drop-shadow-md">{entry.location}</span>
          </div>
        )}

        <p className="text-white/95 text-lg md:text-xl font-medium leading-relaxed md:leading-[1.8] whitespace-pre-wrap drop-shadow-sm">
          {entry.content}
        </p>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10 text-white/50 text-sm font-bold tracking-wide">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl shadow-inner">
            <CalendarIcon className="w-4 h-4" />
            <span>{d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl shadow-inner">
            <Clock className="w-4 h-4" />
            <span>{d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function JournalPage() {
  const { currentTrip } = useTripContext();
  const [entries, setEntries] = useState([]);
  
  // Composer state
  const [newEntry, setNewEntry] = useState({ content: '', location: '', mood: 'happy', weather: 'sunny', searchImage: '' });
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const { addToast } = useToast();

  const composerRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(composerRef, { maxTilt: 3, stiffness: 250, damping: 25 });

  const destLabel = currentTrip
    ? (currentTrip.destination?.split('&')[0] || currentTrip.destination).replace(/Explorer|Roadtrip|Road Trip|Retreat|Escape|Getaway/gi, '').trim()
    : 'Your Trip';

  useEffect(() => {
    if (currentTrip?._id) {
      const saved = localStorage.getItem(`packwise_journal_${currentTrip._id}`);
      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        setEntries(MOCK_ENTRIES.map(e => ({...e, location: destLabel})));
      }
    }
  }, [currentTrip?._id, destLabel]);

  useEffect(() => {
    if (currentTrip?._id) {
      localStorage.setItem(`packwise_journal_${currentTrip._id}`, JSON.stringify(entries));
    }
  }, [entries, currentTrip?._id]);

  const searchImages = async () => {
    if (!newEntry.searchImage && !destLabel) return;
    setIsSearchingImages(true);
    try {
      const q = newEntry.searchImage || destLabel;
      const res = await api.get(`/images/search?query=${encodeURIComponent(q)}`);
      if (res.data?.data?.imageUrl) {
        setSuggestedImages([res.data.data.imageUrl]);
        setSelectedImage(res.data.data.imageUrl); // auto-select the first one
      } else {
        setSuggestedImages([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleSaveEntry = () => {
    if (!newEntry.content.trim()) return;

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: newEntry.content,
      location: newEntry.location || destLabel,
      mood: newEntry.mood,
      weather: newEntry.weather,
      image: selectedImage
    };

    setEntries([entry, ...entries]);
    
    // Reset composer
    setNewEntry({ content: '', location: '', mood: 'happy', weather: 'sunny', searchImage: '' });
    setSelectedImage(null);
    setSuggestedImages([]);
    setIsPhotoMode(false);
  };
  
  const generateAIStory = async () => {
    if (!currentTrip || !currentTrip._id) {
      addToast('error', 'No active trip to generate a story for.');
      return;
    }
    setIsGeneratingStory(true);
    addToast('info', 'Genie is writing your story...');
    try {
      const res = await api.post('/ai/memory-journal', { tripId: currentTrip._id });
      const data = res.data;
      const aiEntry = {
        id: Date.now() + 1,
        date: new Date().toISOString(),
        content: `${data.memoryJournal.story}\n\n✨ Highlights:\n${data.memoryJournal.highlights.map(h => '• '+h).join('\n')}\n\n📸 Caption: ${data.memoryJournal.shareableCaption}`,
        location: currentTrip.destination || destLabel,
        mood: data.memoryJournal.mood || 'happy',
        weather: 'sunny',
        image: null // could search an image based on title
      };
      setEntries([aiEntry, ...entries]);
      addToast('success', 'AI Memory Story generated!');
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to generate AI story');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="col-span-12 w-full min-h-full flex flex-col max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12 perspective-[2000px] gap-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2 drop-shadow-xl w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-pink-400 drop-shadow-md">
          <Book className="w-6 h-6" />
          <span className="text-sm font-black uppercase tracking-[0.25em]">Journal</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 leading-tight drop-shadow-lg">
          {destLabel}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/70 text-base font-medium drop-shadow-md">
          Document your memories, thoughts, and feelings.
        </motion.p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT PANE: STICKY COMPOSER                                */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[450px] shrink-0">
          <div className="flex flex-col gap-6 lg:sticky lg:top-8 z-20">

            {/* Composer Card */}
          <motion.div 
            ref={composerRef}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative w-full rounded-[32px] overflow-hidden bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.4)]"
          >

            <div className="relative z-10 p-5 pb-0 flex flex-col gap-5" style={{ transform: "translateZ(30px)" }}>
              {/* Mood Toggles */}
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-2xl p-2 border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                {MOODS.map(m => {
                  const Icon = m.icon;
                  const isActive = newEntry.mood === m.id;
                  return (
                    <button key={m.id} onClick={() => setNewEntry({...newEntry, mood: m.id})}
                      className={`relative flex-1 py-3 flex justify-center items-center rounded-xl transition-all duration-300 ${isActive ? `${m.bg} shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] border border-white/20 -translate-y-1` : 'hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-transparent'}`}>
                      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? `${m.color} drop-shadow-[0_0_10px_currentColor] scale-110` : 'text-white/40 hover:scale-110 hover:text-white/80'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Weather Toggles */}
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-2xl p-2 border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                {WEATHER.map(w => {
                  const Icon = w.icon;
                  const isActive = newEntry.weather === w.id;
                  return (
                    <button key={w.id} onClick={() => setNewEntry({...newEntry, weather: w.id})}
                      className={`relative flex-1 py-3 flex justify-center items-center rounded-xl transition-all duration-300 ${isActive ? `${w.bg} shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] border border-white/20 -translate-y-1` : 'hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-transparent'}`}>
                      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? `${w.color} drop-shadow-[0_0_10px_currentColor] scale-110` : 'text-white/40 hover:scale-110 hover:text-white/80'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Location Input */}
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-2xl px-5 py-4 border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] focus-within:border-pink-500/50 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_20px_rgba(236,72,153,0.3),inset_0_2px_8px_rgba(0,0,0,0.1)] transition-all">
                <MapPin className="w-5 h-5 text-white/50 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Where are you right now?" 
                  value={newEntry.location} 
                  onChange={(e) => setNewEntry({...newEntry, location: e.target.value})}
                  className="bg-transparent border-none outline-none text-white text-base font-medium w-full placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Text Area */}
            <div className="relative z-10 p-5" style={{ transform: "translateZ(40px)" }}>
              <textarea
                placeholder="What made today special?"
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/20 min-h-[160px] resize-none text-xl font-medium leading-relaxed drop-shadow-sm"
              />
            </div>

            {/* Photo Attachment (Collapsible) */}
            <AnimatePresence>
              {isPhotoMode && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="relative z-10 px-5 pb-5 overflow-hidden"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="bg-black/30 rounded-2xl p-4 border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-white/50 drop-shadow-md">Search Photo</span>
                      <button onClick={() => setIsPhotoMode(false)} className="text-white/30 hover:text-white transition-colors bg-white/5 p-1 rounded-full hover:bg-red-500/80">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" placeholder="e.g. Kyoto sunset" 
                        value={newEntry.searchImage} onChange={(e) => setNewEntry({...newEntry, searchImage: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && searchImages()}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white min-w-0 outline-none focus:border-pink-500/50 shadow-inner"
                      />
                      <button onClick={searchImages} className="shrink-0 bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 px-5 py-3 rounded-xl text-sm font-black text-white transition-all shadow-[0_5px_15px_rgba(236,72,153,0.4)] active:scale-95">
                        {isSearchingImages ? '...' : 'Go'}
                      </button>
                    </div>
                    {selectedImage && (
                      <div className="mt-3 relative rounded-xl overflow-hidden h-40 border border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                        <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                        <button onClick={() => setSelectedImage(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors border border-white/20 shadow-lg">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

              {/* Action Footer */}
            <div className="relative z-10 px-5 py-5 bg-white/[0.02] border-t border-white/10 flex justify-between items-center backdrop-blur-2xl" style={{ transform: "translateZ(20px)" }}>
              <button 
                onClick={() => setIsPhotoMode(!isPhotoMode)}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all shrink-0 ${isPhotoMode || selectedImage ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] scale-105' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]'}`}
              >
                <ImageIcon className="w-5 h-5 drop-shadow-md" />
              </button>
              
              <button 
                onClick={handleSaveEntry} 
                disabled={!newEntry.content.trim()} 
                className="flex items-center gap-2 px-8 py-3.5 rounded-full shrink-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-base font-black hover:shadow-[0_10px_30px_rgba(236,72,153,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1 active:translate-y-0 border border-white/20"
              >
                <Send className="w-5 h-5 drop-shadow-md" />
                Post Entry
              </button>
            </div>
          </motion.div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: FEED OF ENTRIES                               */}
        {/* ========================================================= */}
        <div className={`w-full lg:w-0 flex-1 min-w-0 flex flex-col gap-6 z-10 perspective-[2000px] ${entries.length === 0 ? '' : 'pb-32'}`}>
          
          <button 
            onClick={generateAIStory}
            disabled={isGeneratingStory}
            className="w-full relative overflow-hidden group/ai-btn rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4 flex items-center justify-between hover:border-purple-500/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover/ai-btn:opacity-100 transition-opacity blur-xl" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                {isGeneratingStory ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Sparkles className="w-6 h-6 text-white" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-lg">Generate AI Trip Story</span>
                <span className="text-white/60 text-sm">Let Genie write a beautiful memory based on your itinerary.</span>
              </div>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold border border-white/20 group-hover/ai-btn:bg-white/20 transition-all relative z-10">
              Generate
            </div>
          </button>

          {entries.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-full flex-1 flex flex-col items-center justify-center px-4 opacity-90 text-center rounded-[32px] bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.4)]"
            >
              <Book className="w-20 h-20 text-white/30 mb-8 drop-shadow-lg" />
              <h3 className="text-3xl font-black text-white mb-3 drop-shadow-md">No entries yet</h3>
              <p className="text-white/60 text-lg font-medium">Your journey starts here. Write your first memory.</p>
            </motion.div>
          ) : (
            entries.map((entry, idx) => (
              <FeedCard key={entry.id} entry={entry} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
