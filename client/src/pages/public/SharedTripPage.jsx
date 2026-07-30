import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { HeroSection } from '@/components/overview-v2/HeroSection';
import { Loader2, AlertCircle } from 'lucide-react';
import { TripContext } from '@/context/TripContext';
import { ROUTES } from '@/constants/routes';

export const SharedTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        setLoading(true);
        // Hit the new public unauthenticated route
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

    if (tripId) {
      fetchSharedTrip();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
        <p className="text-white/60 max-w-sm mb-8">{error}</p>
        <button 
          onClick={() => navigate(ROUTES.LOGIN)}
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold tracking-wide"
        >
          Go to Voyage Genie
        </button>
      </div>
    );
  }

  // To render the HeroSection, it needs to be wrapped in the TripContext, or we can mock the context
  // HeroSection uses `useTripContext()` which returns { currentTrip }.
  const mockContextValue = {
    currentTrip: trip
  };

  return (
    <TripContext.Provider value={mockContextValue}>
      <div className="min-h-screen bg-[#030712] p-4 md:p-10 flex flex-col items-center">
        {/* Subtle background gradient */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Branding header */}
        <div className="w-full max-w-4xl flex items-center justify-center py-6 mb-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">
              Voyage<span className="text-blue-400">Genie</span>
            </h1>
          </div>
        </div>

        {/* The beautiful Hero Card */}
        <div className="w-full max-w-4xl z-10 flex-1">
          <HeroSection isSharedView={true} />
        </div>
        
        {/* Footer branding */}
        <div className="mt-auto py-8 text-center z-10">
          <p className="text-white/40 text-sm font-medium">
            AI-curated trips by Voyage Genie
          </p>
        </div>
      </div>
    </TripContext.Provider>
  );
};
