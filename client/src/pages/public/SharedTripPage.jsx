import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { HeroSection } from '@/components/overview-v2/HeroSection';
import { Loader2, AlertCircle, Copy, MapPin, Calendar, Clock, Utensils, Coffee, Landmark, ShoppingBag, Music, Camera, Sun, Cloud, CloudRain, PlaneTakeoff, HeartHandshake } from 'lucide-react';
import { TripContext } from '@/context/TripContext';
import { ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

// Helper for parsing weather icons
const renderWeatherIcon = (condition) => {
  if (!condition) return <Cloud className="w-4 h-4 text-slate-400" />;
  const lower = condition.toLowerCase();
  if (lower.includes('sun') || lower.includes('clear')) return <Sun className="w-4 h-4 text-yellow-400" />;
  if (lower.includes('rain') || lower.includes('shower')) return <CloudRain className="w-4 h-4 text-blue-400" />;
  return <Cloud className="w-4 h-4 text-slate-400" />;
};

// Helper for parsing activity icons
const getActivityIcon = (title = '', desc = '', time = '') => {
  const str = (title + ' ' + desc + ' ' + time).toLowerCase();
  if (str.includes('breakfast') || str.includes('coffee') || str.includes('cafe')) return <Coffee className="w-4 h-4" />;
  if (str.includes('lunch') || str.includes('dinner') || str.includes('meal') || str.includes('restaurant')) return <Utensils className="w-4 h-4" />;
  if (str.includes('flight') || str.includes('airport')) return <PlaneTakeoff className="w-4 h-4" />;
  if (str.includes('shop') || str.includes('market')) return <ShoppingBag className="w-4 h-4" />;
  if (str.includes('music') || str.includes('bar') || str.includes('club')) return <Music className="w-4 h-4" />;
  if (str.includes('museum') || str.includes('art') || str.includes('landmark')) return <Landmark className="w-4 h-4" />;
  if (str.includes('photo') || str.includes('scenic')) return <Camera className="w-4 h-4" />;
  return <MapPin className="w-4 h-4" />;
};

export const SharedTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/trips/public/${tripId}`);
        if (response.data?.data) {
          setTrip(response.data.data);
        } else {
          setError('Could not find this trip.');
        }
      } catch (err) {
        console.error('Error fetching shared trip:', err);
        setError('This trip might be private or no longer exists.');
      } finally {
        setLoading(false);
      }
    };
    if (tripId) fetchSharedTrip();
  }, [tripId]);

  const handleDuplicate = async () => {
    if (!isAuthenticated) {
      addToast('info', 'Please log in to save this trip to your account.');
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      setIsDuplicating(true);
      const res = await api.post(`/trips/${trip._id}/duplicate`);
      addToast('success', 'Trip successfully copied to your account!');
      navigate(ROUTES.TRIPS); // Redirect to their trips page
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to duplicate trip.');
    } finally {
      setIsDuplicating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center px-6 pb-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
        <p className="text-white/60 max-w-sm mb-8">{error}</p>
        <button onClick={() => navigate(ROUTES.LOGIN)} className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold tracking-wide">
          Go to Voyage Genie
        </button>
      </div>
    );
  }

  return (
    <TripContext.Provider value={{ currentTrip: trip }}>
      <div className="min-h-screen bg-[#030712] p-4 md:p-10 flex flex-col items-center relative overflow-x-hidden">
        {/* Subtle background gradient */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

        {/* Branding header */}
        <div className="w-full max-w-4xl flex items-center justify-between py-6 mb-2 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">Voyage<span className="text-blue-400">Genie</span></h1>
          </div>
          <button 
            onClick={handleDuplicate} 
            disabled={isDuplicating}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all"
          >
            {isDuplicating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            Save to My Trips
          </button>
        </div>

        {/* The beautiful Hero Card */}
        <div className="w-full max-w-4xl z-10">
          <HeroSection isSharedView={true} />
        </div>

        {/* Main Content Area: Itinerary & Budget */}
        <div className="w-full max-w-4xl z-10 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Itinerary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Calendar className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">Planned Itinerary</h2>
            </div>
            
            {trip.itinerary && Array.isArray(trip.itinerary) ? (
              <div className="flex flex-col gap-4">
                {trip.itinerary.map((day, idx) => (
                  <div key={idx} className="ios-glass-card rounded-[24px] p-5 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                      <div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">Day {day.day || idx + 1}</span>
                        <h3 className="text-lg font-bold text-white">{day.title}</h3>
                      </div>
                      {trip.weather?.forecast?.[idx] && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                          {renderWeatherIcon(trip.weather.forecast[idx].condition)}
                          <span className="text-sm font-semibold text-white/80">{trip.weather.forecast[idx].temp}°C</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {Array.isArray(day.activities) && day.activities.map((act, actIdx) => (
                        <div key={actIdx} className="flex gap-4 group">
                          <div className="flex flex-col items-center mt-1">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                              {getActivityIcon(act.place, act.description, act.time)}
                            </div>
                            {actIdx < day.activities.length - 1 && <div className="w-[2px] h-full bg-white/5 my-1" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-sm font-bold text-white/90">{act.place || act.title}</span>
                              <span className="text-[11px] font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-md">{act.time}</span>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">{act.description || act.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 text-center text-white/60">No specific itinerary planned for this trip.</div>
            )}
          </div>

          {/* Right Column: Budget Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Landmark className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">Cost Estimate</h2>
            </div>
            
            {trip.budgetDetails && trip.budgetDetails.total ? (
              <div className="ios-glass-card rounded-[24px] p-6 border border-white/5 bg-white/[0.02]">
                <div className="text-center mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-2">Total Budget</span>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    {trip.currency === 'INR' ? '₹' : (trip.currency === 'EUR' ? '€' : '$')}{trip.budgetDetails.total.toLocaleString()}
                  </div>
                </div>
                
                {Array.isArray(trip.budgetDetails.categories) && (
                  <div className="space-y-4">
                    {trip.budgetDetails.categories.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${cat.color || 'bg-white'}`} />
                          <span className="text-sm font-semibold text-white/80">{cat.name}</span>
                        </div>
                        <span className="text-sm font-bold text-white">{trip.currency === 'INR' ? '₹' : '$'}{cat.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 text-center text-white/60">
                Estimated budget: {trip.budget} {trip.currency || 'USD'}
              </div>
            )}
            
            {/* Mobile sticky action button */}
            <div className="sm:hidden fixed bottom-6 left-6 right-6 z-50">
              <button 
                onClick={handleDuplicate}
                disabled={isDuplicating}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-[20px] font-bold shadow-[0_8px_32px_rgba(37,99,235,0.4)]"
              >
                {isDuplicating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Copy className="w-5 h-5" />}
                Duplicate Trip
              </button>
            </div>
            
          </div>
        </div>
        
        {/* Footer branding */}
        <div className="mt-16 py-8 text-center z-10 w-full border-t border-white/5">
          <HeartHandshake className="w-6 h-6 text-pink-500 mx-auto mb-3" />
          <p className="text-white/60 text-sm font-medium">
            Shared with love via <span className="text-white font-bold">Voyage Genie</span>
          </p>
        </div>
      </div>
    </TripContext.Provider>
  );
};
