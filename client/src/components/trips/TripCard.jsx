import React, { useRef } from 'react';
import { motion, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { MapPin, Calendar, Clock, Wallet, CloudSun, Box, MoreHorizontal, Edit2, Copy, Share2, Trash2, Heart, FileDown, Plane, Check, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useImageColor } from '@/hooks/useImageColor';
import { useDestinationImage } from '@/hooks/useDestinationImage';
import { useTripContext } from '@/context/TripContext';
import { useToast } from '@/hooks/useToast';
import { useHaptics } from '@/hooks/useHaptics';
import { useTransitionNavigate } from '@/contexts/TransitionContext';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Share } from '@capacitor/share';

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
  const triggerTransition = useTransitionNavigate();
  const { selectTrip, deleteTrip, duplicateTrip, toggleFavoriteTrip, addNotification, updateTripLocal } = useTripContext();
  const { addToast } = useToast();
  const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
  const tiltConfig = isNative ? { maxTilt: 0, stiffness: 0, damping: 0 } : { maxTilt: 6, stiffness: 250, damping: 25 };
  const { rotateX, rotateY, mouseX, mouseY } = useMouseTilt(cardRef, tiltConfig);
  
  // Pass the raw destination — the server extracts the most specific term (city name)
  const { image: destinationImage, loading: imageLoading } = useDestinationImage(trip.destination);
  const displayImage = trip.heroImage || destinationImage;
  const glowColor = useImageColor(displayImage);
  const { heavyTap } = useHaptics();
  
  const [tripScore, setTripScore] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editedStartDate, setEditedStartDate] = useState(trip.startDate ? trip.startDate.split('T')[0] : '');
  const [editedEndDate, setEditedEndDate] = useState(trip.endDate ? trip.endDate.split('T')[0] : '');
  const [editedBudget, setEditedBudget] = useState(trip.budget || '');
  const [editedTravelers, setEditedTravelers] = useState(trip.travelers || 1);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    setIsSaving(true);
    try {
      await updateTripLocal(trip._id, {
        startDate: new Date(editedStartDate).toISOString(),
        endDate: new Date(editedEndDate).toISOString(),
        budget: editedBudget,
        travelers: parseInt(editedTravelers) || 1
      });
      addToast('success', 'Trip updated!');
      setIsEditing(false);
    } catch (err) {
      addToast('error', 'Failed to update trip');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    // Reset state
    setEditedStartDate(trip.startDate ? trip.startDate.split('T')[0] : '');
    setEditedEndDate(trip.endDate ? trip.endDate.split('T')[0] : '');
    setEditedBudget(trip.budget || '');
    setEditedTravelers(trip.travelers || 1);
  };
  
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
      await api.post('/flights/track', {
        tripId: trip._id,
        destination: trip.destination
      });
      addNotification('Tracking Active', `Flight alerts enabled for ${trip.destination}`, 'flight');
      addToast('success', 'Flight tracking enabled!');
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
        style={isNative ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
        whileHover={isNative ? undefined : { y: -8, transition: { duration: 0.3 } }}
        variants={{
          hidden: { opacity: 0, scale: 0.98, y: 20 },
          show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
        }}
        className="relative flex flex-col h-full w-full rounded-[32px] overflow-hidden ios-glass-card cursor-pointer transform-gpu will-change-transform bg-black"
        onClick={(e) => {
          selectTrip(trip._id);
          navigate(ROUTES.OVERVIEW);
        }}
      >
        {/* GPU-Accelerated Interactive Flashlight */}
        {!isNative && (
          <motion.div
            className="pointer-events-none absolute w-[600px] h-[600px] -left-[300px] -top-[300px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50 mix-blend-overlay will-change-transform"
            style={{
              x: mouseX,
              y: mouseY,
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)'
            }}
          />
        )}
        
        {/* Dynamic Glow Effect (Hardware Accelerated Layer) */}
        {!isNative && (
          <div 
            className="absolute -inset-[1px] rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 blur-xl will-change-opacity transform-gpu"
            style={{ background: `linear-gradient(to bottom right, ${glowColor}40, transparent)`, transform: 'translateZ(0)' }}
          />
        )}
        
        {/* Top Half: Image */}
        <div className="relative h-[220px] w-full shrink-0">
          {/* Image & Gradient Wrapper with Overflow Hidden */}
          <div className="absolute inset-0 overflow-hidden bg-[#060b14] z-0 transform-gpu">
            {imageLoading ? (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:scale-110"
                style={{ backgroundImage: `url(${displayImage})` }}
              />
            )}
          </div>
          
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
              
              <div className={`absolute top-full right-0 mt-3 w-44 p-3 rounded-[24px] bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-3xl border border-white/30 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_10px_rgba(255,255,255,0.1)] transition-all duration-400 z-[100] flex flex-col gap-1.5 origin-top-right ${isMenuOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 translate-y-2'}`}>
                
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsEditing(true); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <Edit2 className="w-4 h-4 shrink-0" /> <span className="text-xs font-semibold">Edit</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); duplicateTrip(trip._id); addToast('success', 'Trip duplicated'); }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
                  <Copy className="w-4 h-4 shrink-0" /> <span className="text-xs font-semibold">Duplicate</span>
                </button>
                <button onClick={async (e) => { 
                  e.stopPropagation();
                  
                  if (trip._id.startsWith('local-')) {
                    addToast('warning', 'Please wait for this trip to sync before sharing!');
                    return;
                  }

                  setIsMenuOpen(false); 
                  const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
                  const baseUrl = isNative ? 'https://packwise-neon.vercel.app' : window.location.origin;
                  // Point to the Vercel Serverless Function to inject dynamic Open Graph tags for beautiful link previews
                  const shareUrl = `${baseUrl}/api/share?id=${trip._id}`;

                  if (isNative) {
                    try {
                      await Share.share({
                        title: `${trip.destination} Trip`,
                        text: `Check out my upcoming trip to ${trip.destination} curated by Voyage Genie! \n\n`,
                        url: shareUrl,
                        dialogTitle: 'Share Trip with Buddies',
                      });
                    } catch (err) {
                      console.warn('Native share dismissed', err);
                    }
                  } else {
                    // PWA / Web Browser Flow
                    let sharedViaApi = false;
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: `${trip.destination} Trip`,
                          text: `Check out my upcoming trip to ${trip.destination} curated by Voyage Genie! \n\n`,
                          url: shareUrl,
                        });
                        sharedViaApi = true;
                      } else {
                        throw new Error('Web Share API not supported');
                      }
                    } catch (err) {
                      // Fallback to clipboard if share fails, is dismissed, or isn't supported
                      if (!sharedViaApi) {
                        try {
                          if (navigator.clipboard && window.isSecureContext) {
                            await navigator.clipboard.writeText(shareUrl);
                            addToast('success', 'Link copied to clipboard!');
                          } else {
                            // Legacy fallback
                            const textArea = document.createElement("textarea");
                            textArea.value = shareUrl;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand("copy");
                            textArea.remove();
                            addToast('success', 'Link copied to clipboard!');
                          }
                        } catch (clipErr) {
                          addToast('error', 'Could not copy link to clipboard.');
                        }
                      }
                    }
                  }
                }} className="flex items-center gap-2.5 w-full p-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-colors text-left">
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

          <div className="absolute bottom-4 inset-x-5 flex flex-col items-center text-center ios-3d-element z-10">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <MapPin className="w-4 h-4 text-blue-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{trip.country}</span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] truncate leading-tight w-full">
              {trip.destination}
            </h3>
          </div>
        </div>

        {/* Bottom Half: Content & Metrics */}
        <div className="p-6 flex flex-col justify-between flex-1 relative ios-3d-element bg-transparent">
          
          {/* Date & Duration Row */}
          <div className="flex items-center justify-center mb-4 mt-2">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <input 
                  type="date" 
                  value={editedStartDate} 
                  onChange={(e) => setEditedStartDate(e.target.value)} 
                  onClick={(e) => e.stopPropagation()}
                  className="w-[120px] bg-white/10 border border-white/20 text-white px-2 py-1.5 rounded-xl text-xs font-semibold outline-none focus:border-blue-400 transition-colors [color-scheme:dark] text-center"
                />
                <span className="text-white/50 text-xs">-</span>
                <input 
                  type="date" 
                  value={editedEndDate} 
                  onChange={(e) => setEditedEndDate(e.target.value)} 
                  onClick={(e) => e.stopPropagation()}
                  className="w-[120px] bg-white/10 border border-white/20 text-white px-2 py-1.5 rounded-xl text-xs font-semibold outline-none focus:border-blue-400 transition-colors [color-scheme:dark] text-center"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <Calendar className="w-3 h-3 text-white/80" />
                  </div>
                  <span className="text-sm font-semibold text-white/90 tracking-wide">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ml-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">{getDuration(trip.startDate, trip.endDate)}</span>
                </div>
              </div>
            )}
          </div>

          {/* 3 Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mb-auto text-center">
            {/* Budget */}
            <div className="ios-3d-element flex flex-col items-center justify-center gap-1.5 p-3 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group/metric hover:bg-white/10 transition-colors cursor-default">
              <div className="flex items-center justify-center gap-1.5 text-white/50 group-hover/metric:text-white/70 transition-colors w-full">
                <Wallet className="w-3.5 h-3.5 ios-3d-icon" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">Budget</span>
              </div>
              {isEditing ? (
                <div className="flex items-center justify-center w-full">
                  <select value={editedBudget} onChange={(e) => setEditedBudget(e.target.value)} onClick={(e) => e.stopPropagation()} className="w-[85px] bg-black/40 border border-white/30 rounded-lg text-[11px] font-bold text-white outline-none focus:border-blue-400 p-1 text-center cursor-pointer appearance-none">
                    <option value="Budget" className="text-black">💰 Budget</option>
                    <option value="Moderate" className="text-black">💰💰 Moderate</option>
                    <option value="Luxury" className="text-black">💰💰💰 Luxury</option>
                  </select>
                </div>
              ) : (
                <span className="text-[13px] font-bold text-white truncate w-full">{trip.budget} {trip.currency}</span>
              )}
            </div>
            {/* Travelers */}
            <div className="ios-3d-element flex flex-col items-center justify-center gap-1.5 p-3 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group/metric hover:bg-white/10 transition-colors cursor-default">
              <div className="flex items-center justify-center gap-1.5 text-white/50 group-hover/metric:text-white/70 transition-colors w-full">
                <CloudSun className="w-3.5 h-3.5 ios-3d-icon" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">Travelers</span>
              </div>
              {isEditing ? (
                <div className="flex items-center justify-center w-full">
                  <input type="number" min="1" max="20" value={editedTravelers} onChange={(e) => setEditedTravelers(e.target.value)} onClick={(e) => e.stopPropagation()} className="w-[60px] bg-black/40 border border-white/30 rounded-lg p-1 text-[12px] font-bold text-white outline-none focus:border-blue-400 text-center" />
                </div>
              ) : (
                <span className="text-[13px] font-bold text-white truncate w-full">{trip.travelers} Guests</span>
              )}
            </div>
            {/* Status */}
            <div className="ios-3d-element flex flex-col items-center justify-center gap-1.5 p-3 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group/metric hover:bg-white/10 transition-colors cursor-default">
              <div className="flex items-center justify-center gap-1.5 text-white/50 group-hover/metric:text-white/70 transition-colors w-full">
                <Box className="w-3.5 h-3.5 ios-3d-icon" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">Status</span>
              </div>
              <span className="text-[13px] font-bold text-white truncate capitalize w-full">{trip.status}</span>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-5 relative z-20 ios-3d-element">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full">
                <button onClick={handleCancelEdit} disabled={isSaving} className="flex-1 flex items-center justify-center py-3.5 rounded-[16px] bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-500 hover:to-rose-500 shadow-[0_4px_12px_rgba(225,29,72,0.3)] text-white font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50">
                  <X className="w-4 h-4 mr-1.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="flex-1 flex items-center justify-center py-3.5 rounded-[16px] bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)] text-white font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Check className="w-4 h-4 mr-1.5" />} Save
                </button>
              </div>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); selectTrip(trip._id); triggerTransition(ROUTES.OVERVIEW, { text: 'Generating insights & maps...' }); }} className="w-full flex items-center justify-center py-3.5 rounded-[16px] ios-liquid-button text-white font-bold text-sm tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] cursor-pointer group/btn">
                Open Trip Overview
              </button>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};
