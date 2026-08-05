import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTripContext } from '@/context/TripContext';
import {
  Calendar, MapPin, Clock, ChevronRight, PlaneLanding, Coffee, Map, PlaneTakeoff,
  Sun, Cloud, CloudRain, DollarSign, ChevronDown, GripVertical,
  Utensils, Camera, ShoppingBag, Music, Landmark, CheckCircle2, Wand2, Loader2
} from 'lucide-react';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import api from '@/services/api';
import RouteMapModal from '@/components/calendar/RouteMapModal';
import { useToast } from '@/hooks/useToast';

// ─── Destination-aware activity templates ─────────────────────────────────────
const getActivities = (dest = '', dayNum) => {
  const d = dest.toLowerCase();
  const isBeach    = d.includes('bali') || d.includes('maldives') || d.includes('phuket') || d.includes('coast') || d.includes('beach');
  const isCity     = d.includes('tokyo') || d.includes('paris') || d.includes('london') || d.includes('new york') || d.includes('dubai') || d.includes('rome') || d.includes('sydney');
  const isMountain = d.includes('swiss') || d.includes('alps') || d.includes('himalayas') || d.includes('rockies');

  const templates = {
    beach: [
      [{ time: '07:00', icon: Sun,       title: 'Sunrise Beach Walk',  desc: 'Watch dawn break over the ocean' },
       { time: '10:00', icon: Map,       title: 'Snorkelling Tour',    desc: 'Coral reef exploration with a guide' },
       { time: '14:00', icon: Coffee,    title: 'Beachside Lunch',     desc: 'Fresh seafood at a local shack' },
       { time: '19:00', icon: Music,     title: 'Sunset Cocktails',    desc: 'Rooftop bar with panoramic views' }],
      [{ time: '08:00', icon: Utensils, title: 'Local Breakfast',     desc: 'Try the famous local morning bites' },
       { time: '11:00', icon: Camera,   title: 'Temple Visit',        desc: 'Explore nearby ancient temples' },
       { time: '15:00', icon: ShoppingBag, title: 'Market Stroll',   desc: 'Pick up handmade souvenirs' },
       { time: '20:00', icon: Music,    title: 'Night Market',        desc: 'Street food and live music' }],
    ],
    mountain: [
      [{ time: '06:30', icon: Sun,       title: 'Sunrise Hike',        desc: 'Reach the peak before the crowds' },
       { time: '10:00', icon: Coffee,   title: 'Alpine Café',          desc: 'Hot chocolate with valley views' },
       { time: '13:00', icon: Map,      title: 'Cable Car Ride',       desc: 'Gondola up to the glacier viewpoint' },
       { time: '18:00', icon: Utensils, title: 'Fondue Dinner',        desc: 'Traditional mountain dining' }],
      [{ time: '08:00', icon: Camera,  title: 'Valley Photography',   desc: 'Golden hour over the mountain range' },
       { time: '11:00', icon: Map,     title: 'Ski or Snowshoe',      desc: 'Winter sports on the slopes' },
       { time: '15:00', icon: Coffee,  title: 'Spa & Wellness',       desc: 'Alpine spa after a long day' },
       { time: '19:30', icon: Music,   title: 'Après-Ski',            desc: 'Live music at the lodge bar' }],
    ],
    city: [
      [{ time: '09:00', icon: Landmark,  title: 'Iconic Landmark Tour', desc: 'Start with the most famous sights' },
       { time: '12:00', icon: Utensils, title: 'Michelin Bistro',       desc: 'Reserve a local favourite' },
       { time: '14:30', icon: Camera,   title: 'Museum District',       desc: 'World-class art and history' },
       { time: '20:00', icon: Music,    title: 'Jazz Bar Evening',      desc: 'Live music in the old quarter' }],
      [{ time: '08:30', icon: Coffee,   title: 'Neighbourhood Café',   desc: 'Coffee like a local' },
       { time: '10:30', icon: Map,      title: 'Hidden Alleys Walk',   desc: 'Discover streets off the tourist map' },
       { time: '14:00', icon: ShoppingBag, title: 'Designer Quarter', desc: 'Boutiques and flagship stores' },
       { time: '19:00', icon: Utensils, title: 'Rooftop Dinner',      desc: 'Skyline views with fine dining' }],
    ],
    default: [
      [{ time: '09:00', icon: Sun,       title: 'Morning Exploration',  desc: 'Start the day with fresh eyes' },
       { time: '12:00', icon: Utensils, title: 'Local Restaurant',      desc: 'Try the regional speciality' },
       { time: '15:00', icon: Camera,   title: 'Sightseeing',           desc: 'Explore the main highlights' },
       { time: '19:30', icon: Music,    title: 'Evening Entertainment', desc: 'Dinner and local nightlife' }],
      [{ time: '08:00', icon: Map,      title: 'Guided Tour',           desc: 'Expert local insights' },
       { time: '11:30', icon: Coffee,   title: 'Coffee Break',          desc: 'Artisan café and people watching' },
       { time: '14:30', icon: ShoppingBag, title: 'Market Visit',      desc: 'Pick up unique finds' },
       { time: '19:00', icon: Utensils, title: 'Farewell Dinner',      desc: 'Celebrate the day' }],
    ],
  };

  const set = isBeach ? templates.beach : isMountain ? templates.mountain : isCity ? templates.city : templates.default;
  return set[(dayNum - 1) % set.length];
};

// 🏔️ Real AI Data Parsers 🏔️
const parseWeatherCondition = (condition) => {
  if (!condition) return { icon: Cloud, color: 'text-slate-300', bg: 'bg-slate-400/10' };
  const lower = condition.toLowerCase();
  if (lower.includes('sun') || lower.includes('clear')) return { icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  if (lower.includes('rain') || lower.includes('shower') || lower.includes('storm')) return { icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-400/10' };
  if (lower.includes('snow')) return { icon: CloudRain, color: 'text-sky-300', bg: 'bg-sky-300/10' };
  return { icon: Cloud, color: 'text-slate-300', bg: 'bg-slate-400/10' };
};

const getActivityIcon = (title = '', desc = '', time = '') => {
  const str = (title + ' ' + desc + ' ' + time).toLowerCase();
  if (str.includes('breakfast') || str.includes('coffee') || str.includes('cafe') || str.includes('tea')) return Coffee;
  if (str.includes('lunch') || str.includes('dinner') || str.includes('meal') || str.includes('restaurant') || str.includes('eat') || str.includes('food')) return Utensils;
  if (str.includes('flight') || str.includes('airport') || str.includes('fly')) return PlaneTakeoff;
  if (str.includes('shop') || str.includes('market') || str.includes('mall') || str.includes('store') || str.includes('buy')) return ShoppingBag;
  if (str.includes('music') || str.includes('bar') || str.includes('club') || str.includes('night') || str.includes('party')) return Music;
  if (str.includes('museum') || str.includes('art') || str.includes('gallery') || str.includes('landmark') || str.includes('temple') || str.includes('church') || str.includes('monument')) return Landmark;
  if (str.includes('photo') || str.includes('view') || str.includes('scenic') || str.includes('lookout')) return Camera;
  return MapPin;
};

// 🏔️ Fake weather per day 🏔️
const weatherTypes = [
  { icon: Sun,       label: '28°C Sunny',  color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { icon: Cloud,     label: '22°C Cloudy', color: 'text-slate-300',  bg: 'bg-slate-400/10'  },
  { icon: CloudRain, label: '18°C Rainy',  color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  { icon: Sun,       label: '31°C Clear',  color: 'text-orange-400', bg: 'bg-orange-400/10' },
];

// 🏔️ Destination name cleaner 🏔️
const cleanDest = (raw = '') =>
  raw.replace(/\b(Explorer|Roadtrip|Road Trip|Retreat|Escape|Getaway|Highlights|Lights|Luxury|Surf|Carnival|Backpacking|Journey|Adventure|Holiday|Vacation|Tour|Opera|Gateway|Weekend|Delight|&.*)\b/gi, '')
     .replace(/\s+/g, ' ').trim();

// 🏔️ Itinerary generator 🏔️
const generateItinerary = (trip) => {
  if (!trip) return [];
  const diff   = new Date(trip.endDate) - new Date(trip.startDate);
  const days   = Math.max(1, Math.ceil(diff / 86400000));
  const dest   = trip.destination || '';
  const perDay = Math.round((trip.budget || 3000) / days);

  // If the AI successfully generated the real itinerary, use it natively!
  if (trip.itinerary && Array.isArray(trip.itinerary) && trip.itinerary.length > 0) {
    return trip.itinerary.map((aiDay, idx) => {
      const dateObj = new Date(trip.startDate);
      dateObj.setDate(dateObj.getDate() + idx);
      const isEven = idx % 2 === 0;
      
      // Pull real AI weather for this exact day if available
      let wData = weatherTypes[idx % weatherTypes.length];
      if (trip.weather?.forecast && trip.weather.forecast[idx]) {
        const fc = trip.weather.forecast[idx];
        const { icon, color, bg } = parseWeatherCondition(fc.condition);
        wData = { icon, label: `${fc.temp}°C ${fc.condition}`, color, bg };
      }
      
      // Attempt to calculate a slice of the real total budget if available
      let estBudget = perDay;
      if (trip.budgetDetails?.total) {
        estBudget = Math.round(trip.budgetDetails.total / trip.itinerary.length);
      }

      return {
        day: aiDay.day || (idx + 1),
        title: aiDay.title || `Day ${idx + 1}`,
        date: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        fullDate: dateObj,
        icon: isEven ? Map : Coffee,
        color: isEven ? 'text-emerald-400' : 'text-violet-400',
        bg: isEven ? 'bg-emerald-500/20' : 'bg-violet-500/20',
        border: isEven ? 'border-emerald-500/30' : 'border-violet-500/30',
        glow: isEven ? 'shadow-emerald-500/20' : 'shadow-violet-500/20',
        weather: wData,
        budget: { estimate: estBudget, label: 'Planned' },
        activities: Array.isArray(aiDay.activities) ? aiDay.activities.map(act => ({
          time: act.time,
          icon: getActivityIcon(act.place, act.description, act.time),
          title: act.place,
          desc: act.description
        })) : [],
        img: null,
      };
    });
  }

  // Fallback to fake generation if no AI itinerary exists (e.g. for mock trips)
  const items = [];

  items.push({
    day: 1, title: 'Arrival & Check-in',
    date: new Date(trip.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    fullDate: new Date(trip.startDate),
    icon: PlaneLanding, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', glow: 'shadow-blue-500/20',
    weather: weatherTypes[0],
    budget: { estimate: Math.round(perDay * 0.6), label: 'Light day' },
    activities: [
      { time: '14:00', icon: MapPin,  title: 'Arrival & Transfer', desc: `Arrive at ${cleanDest(dest).split(' ')[0]} and transfer to accommodation` },
      { time: '15:30', icon: Coffee,  title: 'Check-in & Rest',  desc: 'Settle in and freshen up' },
      { time: '17:00', icon: Map,     title: 'Orientation Walk', desc: 'Familiarise yourself with the area' },
      { time: '19:30', icon: Utensils,      title: 'Welcome Dinner',   desc: 'First taste of local cuisine' },
    ],
    img: null,
  });

  for (let i = 2; i < days; i++) {
    const dateObj = new Date(trip.startDate);
    dateObj.setDate(dateObj.getDate() + (i - 1));
    const isEven = i % 2 === 0;

    items.push({
      day: i,
      title: isEven ? 'City Exploration' : 'Cultural Immersion',
      date: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      fullDate: dateObj,
      icon: isEven ? Map : Coffee,
      color: isEven ? 'text-emerald-400' : 'text-violet-400',
      bg: isEven ? 'bg-emerald-500/20' : 'bg-violet-500/20',
      border: isEven ? 'border-emerald-500/30' : 'border-violet-500/30',
      glow: isEven ? 'shadow-emerald-500/20' : 'shadow-violet-500/20',
      weather: weatherTypes[i % weatherTypes.length],
      budget: { estimate: perDay, label: 'Full activity day' },
      activities: getActivities(dest, i),
      img: null,
    });
  }

  if (days > 1) {
    const endDateObj = new Date(trip.endDate);
    items.push({
      day: days, title: 'Departure Day',
      date: endDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      fullDate: endDateObj,
      icon: PlaneTakeoff, color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30', glow: 'shadow-rose-500/20',
      weather: weatherTypes[3],
      budget: { estimate: Math.round(perDay * 0.5), label: 'Travel day' },
      activities: [
        { time: '09:00', icon: Coffee,       title: 'Final Breakfast',   desc: 'One last local meal' },
        { time: '11:00', icon: ShoppingBag,  title: 'Souvenir Shopping', desc: 'Last-minute gifts' },
        { time: '14:30', icon: MapPin, title: 'Departure Journey', desc: `Begin journey home from ${cleanDest(dest).split(' ')[0]}` },
      ],
      img: null,
    });
  }

  return items;
};

// ─── Mini Calendar Grid ────────────────────────────────────────────────────────
const MiniCalendarGrid = ({ trip }) => {
  const start = trip ? new Date(trip.startDate) : null;
  const end   = trip ? new Date(trip.endDate)   : null;
  const viewDate = start || new Date();
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const monthName    = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekdays     = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const today        = new Date();

  const isTripDay = (d) => { if (!start || !end) return false; const dt = new Date(year, month, d); return dt >= start && dt <= end; };
  const isStart   = (d) => start && new Date(year, month, d).toDateString() === start.toDateString();
  const isEnd     = (d) => end   && new Date(year, month, d).toDateString() === end.toDateString();
  const isToday   = (d) => new Date(year, month, d).toDateString() === today.toDateString();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
      className="ios-glass-card rounded-[28px] p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold text-white">{monthName}</span>
        <div className="flex items-center gap-3 text-[10px] text-white/40">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-500/60 inline-block" /> Trip</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/70 inline-block" /> Today</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map(w => <div key={w} className="text-center text-[9px] font-bold text-white/25 pb-1">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
          <div key={d} className={`aspect-square flex items-center justify-center rounded-lg text-[11px] font-semibold transition-all cursor-pointer
            ${isTripDay(d) ? 'bg-cyan-500/20 text-cyan-200' : 'text-white/35 hover:bg-white/5'}
            ${isStart(d) ? '!bg-cyan-500/50 text-white ring-2 ring-cyan-400' : ''}
            ${isEnd(d)   ? '!bg-rose-500/50 text-white ring-2 ring-rose-400' : ''}
            ${isToday(d) && !isTripDay(d) ? 'ring-1 ring-white/30 text-white' : ''}`}>
            {d}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Progress Tracker ─────────────────────────────────────────────────────────
const ProgressTracker = ({ itinerary, trip }) => {
  const today = new Date();
  const start = trip ? new Date(trip.startDate) : null;
  const end   = trip ? new Date(trip.endDate)   : null;
  let statusLabel = 'Planning', doneCount = 0, pct = 0;

  if (start && end) {
    if (today < start)      { statusLabel = 'Upcoming'; }
    else if (today > end)   { statusLabel = 'Completed'; pct = 100; doneCount = itinerary.length; }
    else {
      statusLabel = 'Ongoing';
      pct       = Math.min(100, Math.round(((today - start) / (end - start)) * 100));
      doneCount = itinerary.filter(d => d.fullDate && d.fullDate < today).length;
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
      className="ios-glass-card rounded-[28px] p-6 border border-white/10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">Trip Progress</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold text-white">{pct}%</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusLabel === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-400' : statusLabel === 'Completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/50'}`}>{statusLabel}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-right">
          {[['Done', doneCount], ['Left', itinerary.length - doneCount]].map(([l, v]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-white">{v}</div>
              <div className="text-[9px] text-white/35 uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {itinerary.map((d, i) => (
          <div key={i} title={`Day ${d.day}: ${d.title}`}
            className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${i < doneCount ? 'bg-cyan-400' : i === doneCount ? 'bg-white animate-pulse' : 'bg-white/15'}`} />
        ))}
      </div>
    </motion.div>
  );
};

// ─── Timeline Card 
const TimelineCard = React.memo(({ 
  dayData, index, tripId,
  onDragStartActivity, onDragEnterActivity, onDragEndActivity, onDragOverContainer,
  onOptimizeRoute, onOpenMap
}) => {
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 3, stiffness: 250, damping: 22 });
  const [expanded, setExpanded] = useState(index === 0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { addToast } = useToast();
  const Icon        = dayData.icon;
  const WeatherIcon = dayData.weather?.icon || (() => null);
  const today       = new Date();
  const isDone      = dayData.fullDate && dayData.fullDate < today;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-12 md:pl-24 py-6 w-full group"
    >
      {/* Timeline Node */}
      <div className={`absolute left-0 md:left-10 top-10 w-10 h-10 rounded-full ${dayData.bg} ${dayData.border} border-2 flex items-center justify-center z-20 shadow-lg ${dayData.glow} group-hover:scale-110 transition-transform duration-500`}>
        {isDone ? <CheckCircle2 className={`w-5 h-5 ${dayData.color}`} /> : <Icon className={`w-5 h-5 ${dayData.color}`} />}
      </div>
      <div className="absolute left-5 md:left-14 top-14 w-6 h-px bg-gradient-to-r from-white/20 to-transparent" />

      {/* Card */}
      <motion.div ref={cardRef} style={{ rotateX, rotateY, transformPerspective: 1400 }}
        className="w-full max-w-3xl rounded-[28px] overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl ios-glass-card">

        {/* Hero image */}
        {dayData.img && (
          <div className="relative h-36 overflow-hidden">
            <img src={dayData.img} alt={dayData.title} onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B1120]/80" />
          </div>
        )}

        {/* Clickable header */}
        <button onClick={() => setExpanded(p => !p)} className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${dayData.color}`}>Day {dayData.day} · {dayData.date}</span>
            <h3 className="text-xl font-bold text-white tracking-tight">{dayData.title}</h3>
            <div className="flex flex-wrap gap-2 mt-0.5">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${dayData.weather.bg} text-xs font-semibold ${dayData.weather.color}`}>
                <WeatherIcon className="w-3.5 h-3.5" />{dayData.weather.label}
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-xs font-semibold text-white/50">
                <DollarSign className="w-3.5 h-3.5" />~${dayData.budget.estimate} · {dayData.budget.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-shrink-0">
            {isDone && <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Done</span>}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}
              className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ChevronDown className="w-4 h-4 text-white/50" />
            </motion.div>
          </div>
        </button>

        {/* Expandable activities */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
              <div 
                className="px-5 sm:px-6 pb-5 flex flex-col gap-2 min-h-[60px]"
                onDragOver={(e) => onDragOverContainer(e, index)}
              >
                {dayData.activities.map((act, i) => {
                  const ActIcon = act.icon || Clock;
                  return (
                    <motion.div 
                      key={`${act.title}-${i}`} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      draggable
                      onDragStart={(e) => onDragStartActivity(e, index, i)}
                      onDragEnter={(e) => onDragEnterActivity(e, index, i)}
                      onDragEnd={onDragEndActivity}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex items-center gap-3 p-3.5 rounded-[16px] bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-white/20 transition-all cursor-grab active:cursor-grabbing group/act relative"
                    >
                      <div className="absolute -left-3 p-1.5 rounded-full bg-white/10 border border-white/20 shadow-sm opacity-0 group-hover/act:opacity-100 transition-opacity flex items-center justify-center">
                        <GripVertical className="w-3.5 h-3.5 text-white/70" />
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <ActIcon className={`w-4 h-4 ${dayData.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white/35">{act.time}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-sm font-bold text-white truncate">{act.title}</span>
                        </div>
                        <span className="text-xs text-white/35 block mt-0.5">{act.desc}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover/act:text-white/60 group-hover/act:translate-x-0.5 transition-all flex-shrink-0" />
                    </motion.div>
                  );
                })}
              </div>

              <div className="mx-5 sm:mx-6 mb-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {['J','S'].map((l, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#0B1120] flex items-center justify-center text-[9px] font-bold text-white ${i === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}>{l}</div>
                    ))}
                  </div>
                  <span className="text-xs text-white/30">{(trip => trip?.travelers || 2)(null)} travellers</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      setIsOptimizing(true);
                      await onOptimizeRoute(index);
                      setIsOptimizing(false);
                    }}
                    disabled={isOptimizing}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenMap(index); }} className="text-xs font-semibold text-white/40 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all flex items-center gap-1">
                    <MapPin className="w-3 h-3" />Map
                  </button>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToast('info', '✨ Feature coming soon!'); }} className={`text-xs font-bold uppercase tracking-wider ${dayData.color} hover:opacity-70 transition-opacity ml-1`}>Edit</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { currentTrip } = useTripContext();
  const { playSound } = useSoundEffect();
  const [itinerary, setItinerary]  = useState([]);
  const containerRef = useRef(null);
  const [mapDayIndex, setMapDayIndex] = useState(null);
  
  // Custom toast mock for demo
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const lineHeight    = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const particleTop   = useTransform(scrollYProgress, [0, 1], ['32px', '100%']);

  const destLabel = currentTrip
    ? cleanDest(currentTrip.destination) || currentTrip.destination?.split('&')[0].trim()
    : 'Your Destination';

  // --- HTML5 Drag & Drop Handlers ---
  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);

  const handleDragStartActivity = (e, dayIndex, actIndex) => {
    dragItemRef.current = { dayIndex, actIndex };
    // Make the original element slightly transparent while dragging
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => { e.target.classList.add('opacity-40'); }, 0);
  };

  const handleDragEnterActivity = (e, dayIndex, actIndex) => {
    dragOverItemRef.current = { dayIndex, actIndex };
  };

  const handleDragOverContainer = (e, dayIndex) => {
    e.preventDefault(); // allow dropping in an empty container
    // If the list is empty and we drag over it, set target index to 0
    if (itinerary[dayIndex]?.activities.length === 0) {
      dragOverItemRef.current = { dayIndex, actIndex: 0 };
    }
  };

  const handleDragEndActivity = (e) => {
    e.target.classList.remove('opacity-40');
    if (!dragItemRef.current || !dragOverItemRef.current) return;

    const source = dragItemRef.current;
    const dest = dragOverItemRef.current;

    // Prevent doing nothing if dropped in same place
    if (source.dayIndex === dest.dayIndex && source.actIndex === dest.actIndex) return;

    setItinerary(prev => {
      const newItinerary = [...prev];
      const sourceActivities = [...newItinerary[source.dayIndex].activities];
      const destActivities = source.dayIndex === dest.dayIndex ? sourceActivities : [...newItinerary[dest.dayIndex].activities];

      const [movedItem] = sourceActivities.splice(source.actIndex, 1);
      destActivities.splice(dest.actIndex, 0, movedItem);

      newItinerary[source.dayIndex] = { ...newItinerary[source.dayIndex], activities: sourceActivities };
      if (source.dayIndex !== dest.dayIndex) {
        newItinerary[dest.dayIndex] = { ...newItinerary[dest.dayIndex], activities: destActivities };
      }
      return newItinerary;
    });

    dragItemRef.current = null;
    dragOverItemRef.current = null;
  };
  
  const handleOptimizeRoute = async (dayIndex) => {
    if (!currentTrip) return;
    try {
      const dayObj = itinerary[dayIndex];
      if (!dayObj || !dayObj.activities || dayObj.activities.length < 2) return;
      
      const res = await api.post('/ai/optimize-itinerary', {
        itinerary: [dayObj],
        destination: currentTrip.destination
      });
      
      const data = res.data;
      setItinerary(prev => {
        const newItinerary = [...prev];
        newItinerary[dayIndex] = data.optimized[0];
        return newItinerary;
      });
      playSound('success');
      showToast(`Route optimized! Saved ~${data.totalSavedMinutes} mins of travel.`);
    } catch (err) {
      console.error(err);
      showToast('Optimization failed. Try again.');
    }
  };
  // ------------------------------------

  // Generate itinerary immediately; then load images async
  useEffect(() => {
    if (!currentTrip) return;
    const base = generateItinerary(currentTrip);
    setItinerary(base);

    // Use only the city part to avoid the backend's comma-splitter ignoring the suffix
    const rawDest = currentTrip.destination || '';
    const cityOnly = rawDest.split(',')[0].trim();
    const place = cleanDest(cityOnly);
    
    // We append these suffixes to get different types of images for different days
    const suffixes = ['landmark', 'nature scenic', 'food', 'culture', 'architecture', 'cityscape', 'market', 'nightlife'];

    const fetchImg = async (suffix) => {
      try {
        const q = `${place} ${suffix}`;
        const res = await api.get(`/images/search?query=${encodeURIComponent(q)}`);
        if (res.data?.data?.imageUrl) return res.data.data.imageUrl;
      } catch (_) {}
      return null;
    };

    (async () => {
      const imgs = await Promise.all(suffixes.slice(0, base.length).map(fetchImg));
      
      // If some queries fail, fill them in by reusing the successful ones so we don't have blank cards
      const validImgs = imgs.filter(Boolean);
      const finalImgs = imgs.map((img, i) => img || validImgs[i % validImgs.length] || null);

      setItinerary(prev => prev.map((d, i) => ({ ...d, img: finalImgs[i] })));
    })();
  }, [currentTrip?._id]);

  return (
    <div className="col-span-12 w-full min-h-screen flex flex-col pt-4 md:pt-8 pb-28" ref={containerRef}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-emerald-500/90 backdrop-blur-md rounded-full shadow-lg border border-emerald-400">
            <span className="text-white font-bold text-sm tracking-wide">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 px-4 md:px-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 text-pink-400">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Itinerary</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl font-semibold tracking-tighter text-white truncate max-w-full">
          {destLabel} <span className="text-white/30 hidden sm:inline-block">Timeline</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/50 text-lg max-w-xl">
          Your cinematic, day-by-day journey — real photos, weather, and budget for every stop.
        </motion.p>
      </div>

      {/* Widgets Row */}
      <div className="px-4 md:px-12 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MiniCalendarGrid trip={currentTrip} />
        <ProgressTracker itinerary={itinerary} trip={currentTrip} />
      </div>

      {/* Timeline */}
      <div className="relative w-full max-w-5xl mx-auto px-4 md:px-12">
        {/* Track */}
        <div className="absolute left-[39px] md:left-[79px] top-8 bottom-0 w-[2px] bg-white/5 rounded-full" />

        {/* Animated fill */}
        <motion.div
          className="absolute left-[39px] md:left-[79px] top-8 w-[2px] rounded-full bg-gradient-to-b from-pink-400 via-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(56,189,248,0.5)] origin-top z-10"
          style={{ height: lineHeight }}
        />

        {/* Glowing scroll particle */}
        <motion.div
          className="absolute left-[34px] md:left-[74px] w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_14px_5px_rgba(56,189,248,0.55)] z-20 pointer-events-none"
          style={{ top: particleTop }}
        />

        {itinerary.map((day, i) => (
          <TimelineCard 
            key={`${currentTrip?._id}-day-${i}`} 
            dayData={day} 
            index={i} 
            tripId={currentTrip?._id}
            onDragStartActivity={handleDragStartActivity}
            onDragEnterActivity={handleDragEnterActivity}
            onDragEndActivity={handleDragEndActivity}
            onDragOverContainer={handleDragOverContainer}
            onOptimizeRoute={handleOptimizeRoute}
            onOpenMap={setMapDayIndex}
          />
        ))}
      </div>

      {mapDayIndex !== null && itinerary[mapDayIndex] && (
        <RouteMapModal 
          dayData={itinerary[mapDayIndex]} 
          destination={currentTrip?.destination} 
          onClose={() => setMapDayIndex(null)} 
        />
      )}

    </div>
  );
}


