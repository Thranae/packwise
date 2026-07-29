import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { X, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function RouteMapModal({ dayData, destination, onClose }) {
  const [day, setDay] = useState(dayData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeocode = async () => {
      // Check if all activities have lat and lon
      const needsGeocode = dayData.activities.some(act => act.lat === undefined || act.lon === undefined);
      
      if (needsGeocode) {
        setLoading(true);
        try {
          const res = await api.post('/ai/geocode-route', {
            itinerary: [dayData],
            destination
          });
          setDay(res.data.geocodedDay);
        } catch (err) {
          console.error('Failed to geocode route', err);
          setError('Failed to load map points.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGeocode();
  }, [dayData, destination]);

  const validActivities = day.activities.filter(act => act.lat !== undefined && act.lon !== undefined);

  // Calculate center and bounds
  let initialViewState = {
    longitude: 0,
    latitude: 0,
    zoom: 2
  };

  if (validActivities.length > 0) {
    const lats = validActivities.map(a => a.lat);
    const lons = validActivities.map(a => a.lon);
    initialViewState.latitude = lats.reduce((a, b) => a + b, 0) / lats.length;
    initialViewState.longitude = lons.reduce((a, b) => a + b, 0) / lons.length;
    initialViewState.zoom = 11;
  }

  // Create GeoJSON route
  const routeGeojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: validActivities.map(act => [act.lon, act.lat])
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }} 
          className="ios-glass-card w-full max-w-5xl h-[80vh] rounded-[32px] overflow-hidden flex flex-col relative border-white/10 shadow-2xl"
        >
          <div className="p-5 flex items-center justify-between border-b border-white/10 bg-white/5">
            <div>
              <h2 className="text-xl font-bold text-white">Day {day.day} Route</h2>
              <p className="text-sm text-white/50">{day.title}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative bg-[#0B1120]">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1120]/50 backdrop-blur-md z-10">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
                <p className="text-white font-medium">Mapping your route...</p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-rose-400">
                {error}
              </div>
            ) : (
              <Map
                initialViewState={initialViewState}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
              >
                {validActivities.length > 1 && (
                  <Source type="geojson" data={routeGeojson}>
                    <Layer 
                      id="route" 
                      type="line" 
                      paint={{ "line-color": "#0ea5e9", "line-width": 4 }} 
                    />
                  </Source>
                )}

                {validActivities.map((act, index) => (
                  <Marker 
                    key={index} 
                    longitude={act.lon} 
                    latitude={act.lat}
                    anchor="bottom"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center shadow-lg text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </Marker>
                ))}
              </Map>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
