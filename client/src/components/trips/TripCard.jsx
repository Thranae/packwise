import React, { useRef } from 'react';
import { motion, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { MapPin, Calendar, Clock, Wallet, CloudSun, Box, MoreHorizontal, Edit2, Copy, Share2, Trash2, Heart, FileDown, Plane } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useImageColor } from '@/hooks/useImageColor';
import { useDestinationImage } from '@/hooks/useDestinationImage';
import { useTripContext } from '@/context/TripContext';
import { useToast } from '@/hooks/useToast';
import { useHaptics } from '@/hooks/useHaptics';
import { useState, useEffect } from 'react';
import api from '@/services/api';

// Simple formatter
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDuration = (start, end) => {
  if (!start || !end) return '? Days';
  const diff = new Date(end) - new Date(start);
  return `${Math.ceil(diff / (1000 * 60 * 60 * 24))} Days`;
};

export const TripCard = ({ trip }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { selectTrip, deleteTrip, duplicateTrip, toggleFavoriteTrip, addNotification } = useTripContext();
  const { addToast } = useToast();
  const { rotateX, rotateY, mouseX, mouseY } = useMouseTilt(cardRef, { maxTilt: 6, stiffness: 250, damping: 25 });
  
  // Pass the raw destination — the server extracts the most specific term (city name)
  const { image: destinationImage, loading: imageLoading } = useDestinationImage(trip.destination);
  const displayImage = trip.heroImage || destinationImage;
  const glowColor = useImageColor(displayImage);
  const { heavyTap } = useHaptics();
  
  const [tripScore, setTripScore] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    if (!trip._id || trip._id.startsWith('mock')) return;
    api.get(`/ai/trip-score/${trip._id}`)
      .then(res => res.data)
      .then(data => {
        if (data && data.overallScore) setTripScore(data);
      })
      .catch(() => {}); // silent fail for now
  }, [trip._id]);
  
  const handleDownloadPDF = async (e) => {
    e.stopPropagation();
    try {
      addToast('info', 'Generating Premium PDF...');
      const { generatePremiumPDF } = await import('@/utils/pdfGenerator');
      await generatePremiumPDF(trip);
      addToast('success', 'PDF downloaded successfully!');
      
      const destName = trip?.destination?.split('&')[0] || 'Unknown Destination';
      addNotification('PDF Exported', `Your premium itinerary for ${destName} is ready.`, 'pdf');
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to generate PDF');
    }
  };
  
  const handleTrackFlights = async (e) => {
    e.stopPropagation();
    try {
      addToast('info', 'Enabling flight tracking...');
      const res = await api.post('/flights/track', {
        tripId: trip._id,
        origin: "JFK", // Usually provided by user profile
        destination: trip.destination,
        date: trip.startDate
      });
      if (res.status >= 200 && res.status < 300) {
        addToast('success', 'Flight tracking enabled!');
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      addToast('error', 'Failed to enable flight tracking');
    }
  };
  
  const getStatusColor = (status) => {
    const base = "bg-clip-text text-transparent bg-gradient-to-br";
    switch(status?.toLowerCase()) {
      case 'upcoming': return `${base} from-blue-200 via-blue-400 to-blue-600`;
      case 'ongoing': return `${base} from-emerald-200 via-emerald-400 to-emerald-600`;
      case 'planning': return `${base} from-amber-200 via-amber-400 to-amber-600`;
      case 'draft': return `${base} from-white via-white/80 to-white/40`;
      case 'completed': return `${base} from-purple-200 via-purple-400 to-purple-600`;
      default: return `${base} from-white via-white/80 to-white/40`;
    }
  };
  
  return (
    <div className="relative w-full h-[460px] rounded-[32px] overflow-hidden group">
      <motion.div 
        ref={cardRef}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        variants={{
          hidden: { opacity: 0, scale: 0.95, y: 30, rotateX: 10 },
          show: { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
        }}
        className="relative flex flex-col h-full w-full rounded-[32px] overflow-hidden ios-glass-card cursor-pointer transform-gpu [transform-style:preserve-3d] will-change-transform bg-black"
        onClick={(e) => {
          selectTrip(trip._id);
          navigate(ROUTES.OVERVIEW);
        }}
      >
        {/* GPU-Accelerated Interactive Flashlight */}
        <motion.div
          className="pointer-events-none absolute w-[600px] h-[600px] -left-[300px] -top-[300px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50 mix-blend-overlay will-change-transform"
          style={{
            x: mouseX,
            y: mouseY,
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)'
          }}
        />
        
        {/* Dynamic Glow Effect (Hardware Accelerated Layer) */}
        <div 
          className="absolute -inset-[1px] rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 blur-xl will-change-opacity transform-gpu"
          style={{ background: `linear-gradient(to bottom right, ${glowColor}40, transparent)`, transform: 'translateZ(0)' }}
        />
        
        {/* Top Half: Image */}
        <div className="relative h-[220px] w-full shrink-0">
          {/* Image & Gradient Wrapper with Overflow Hidden */}
          <motion.div layoutId={`trip-image-${trip._id}`} className="absolute inset-0 overflow-hidden bg-[#060b14] z-0">
            {imageLoading ? (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:scale-110"
                style={{ backgroundImage: `url(${displayImage})` }}
              />
            )}
            {/* Gradient to blend with content */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-black/30 to-transparent pointer-events-none" />
          </motion.div>
          
          {/* Top Badges (Now outside overflow-hidden) */}
          <div className="absolute top-5 inset-x-5 flex items-start justify-between ios-3d-element z-50">
            <div className="px-4 py-1.5 flex items-center justify-center rounded-[12px] bg-black/10 hover:bg-black/30 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.6),0_12px_24px_rgba(0,0,0,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-500 cursor-default">
              <span className={`text-[11px] font-extrabold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${getStatusColor(trip.status)}`}>
                {trip.status}
              </span>
            </div>

            {tripScore && (
              <div className="absolute top-0 right-14 px-3 py-1.5 flex items-center gap-1.5 rounded-[12px] bg-black/40 backdrop-blur-md border border-white/20 shadow-lg cursor-default group/score" title={tripScore.label}>
                <div className={`w-2 h-2 rounded-full ${tripScore.overallScore >= 80 ? 'bg-emerald-400' : tripScore.overallScore >= 50 ? 'bg-amber-400' : 'bg-red-400'} animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
                <span className="text-[11px] font-bold text-white tracking-wide">{tripScore.overallScore}%</span>
              </div>
            )}
            
            
            {/* Quick Actions Dropdown */}
            <div className="relative group/menu" onMouseLeave={() => setIsMenuOpen(false)} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
              <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsMenuOpen(!isMenuOpen); }} className="w-10 h-10 rounded-[14px] bg-black/30 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-white transition-all duration-500">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              <div className={`absolute top-full right-0 mt-2 w-40 p-2 rounded-[20px] bg-black/70 backdrop-blur-2xl border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] transition-all duration-400 z-50 flex flex-col gap-1 origin-top-right ${isMenuOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 translate-y-2'}`}>
                
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); selectTrip(trip._id); navigate(ROUTES.TRIPS_NEW); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <Edit2 className="w-4 h-4 shrink-0" /> <span className="text-xs font-semibold">Edit</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); duplicateTrip(trip._id); addToast('success', 'Trip duplicated'); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <Copy className="w-4 h-4 shrink-0" /> <span className="text-xs font-semibold">Duplicate</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); navigator.clipboard.writeText(window.location.origin + ROUTES.OVERVIEW); addToast('success', 'Link copied to clipboard!'); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <Share2 className="w-4 h-4 shrink-0" /> <span className="text-xs font-semibold">Share</span>
                </button>
                <button onClick={(e) => { setIsMenuOpen(false); handleDownloadPDF(e); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <FileDown className="w-4 h-4 shrink-0 text-blue-400" /> <span className="text-xs font-semibold text-blue-400">Export PDF</span>
                </button>
                <button onClick={(e) => { setIsMenuOpen(false); handleTrackFlights(e); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <Plane className="w-4 h-4 shrink-0 text-amber-400" /> <span className="text-xs font-semibold text-amber-400">Track Flights</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); toggleFavoriteTrip(trip._id); addToast('success', trip.isFavorite ? 'Removed from favorites' : 'Added to favorites'); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <Heart className={`w-4 h-4 shrink-0 ${trip.isFavorite ? 'fill-red-500 text-red-500' : ''}`} /> <span className="text-xs font-semibold">{trip.isFavorite ? 'Unfavorite' : 'Favourite'}</span>
                </button>
                <div className="h-[1px] w-full bg-white/10 my-1" />
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); deleteTrip(trip._id); addToast('success', 'Trip deleted'); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-red-500/20 hover:text-red-400 text-red-400/80 transition-colors text-left">
                  <Trash2 className="w-4 h-4 shrink-0" /> <span className="text-xs font-semibold">Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 inset-x-5 flex flex-col ios-3d-element z-10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 drop-shadow-md">{trip.country}</span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tighter text-white drop-shadow-lg truncate leading-tight">
              {trip.destination}
            </h3>
          </div>
        </div>

        {/* Bottom Half: Content & Metrics */}
        <div className="p-6 flex flex-col justify-between flex-1 relative ios-3d-element bg-transparent">
          
          {/* Date & Duration Row */}
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Calendar className="w-4 h-4 text-white/80" />
              </div>
              <span className="text-sm font-semibold text-white/90 tracking-wide">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">{getDuration(trip.startDate, trip.endDate)}</span>
              <div className="w-8 h-8 rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* 3 Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mb-auto">
            {/* Budget */}
            <div className="ios-3d-element flex flex-col gap-1.5 p-3 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group/metric hover:bg-white/10 transition-colors cursor-default">
              <div className="flex items-center gap-1.5 text-white/50 group-hover/metric:text-white/70 transition-colors">
                <Wallet className="w-3.5 h-3.5 ios-3d-icon" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">Budget</span>
              </div>
              <span className="text-[13px] font-bold text-white truncate">{trip.budget} {trip.currency}</span>
            </div>
            {/* Weather */}
            <div className="ios-3d-element flex flex-col gap-1.5 p-3 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group/metric hover:bg-white/10 transition-colors cursor-default">
              <div className="flex items-center gap-1.5 text-white/50 group-hover/metric:text-white/70 transition-colors">
                <CloudSun className="w-3.5 h-3.5 ios-3d-icon" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">Travelers</span>
              </div>
              <span className="text-[13px] font-bold text-white truncate">{trip.travelers} Guests</span>
            </div>
            {/* Packing */}
            <div className="ios-3d-element flex flex-col gap-1.5 p-3 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group/metric hover:bg-white/10 transition-colors cursor-default">
              <div className="flex items-center gap-1.5 text-white/50 group-hover/metric:text-white/70 transition-colors">
                <Box className="w-3.5 h-3.5 ios-3d-icon" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">Status</span>
              </div>
              <span className="text-[13px] font-bold text-white truncate capitalize">{trip.status}</span>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-5 relative z-20 ios-3d-element">
            <button onClick={(e) => { e.stopPropagation(); selectTrip(trip._id); navigate(ROUTES.OVERVIEW); }} className="w-full flex items-center justify-center py-3.5 rounded-[16px] ios-liquid-button text-white font-bold text-sm tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] cursor-pointer group/btn">
              Open Trip Overview
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
