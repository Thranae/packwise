import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Compass, Loader2 } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';
import { useMouseTilt } from '@/hooks/useMouseTilt';

export const InteractiveGlobeWidget = ({ className = "" }) => {
  const cardRef = useRef(null);
  const globeEl = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 3, stiffness: 200, damping: 20 });
  const { currentTrip } = useTripContext();

  const [coords, setCoords] = useState(null);
  const [originCoords, setOriginCoords] = useState({ lat: 51.5074, lng: -0.1278 }); // London default
  const [originInput, setOriginInput] = useState("");
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState({ features: [] });
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 });

  // Track container size for responsive globe
  useEffect(() => {
    if (!cardRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setGlobeSize({ width: Math.round(width), height: Math.round(height) });
      }
    });
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  // Fetch GeoJSON removed for realistic map

  // Geocode destination
  useEffect(() => {
    if (!currentTrip?.destination) {
      setLoading(false);
      return;
    }

    const fetchCoords = async () => {
      setLoading(true);
      try {
        const query = currentTrip.destination.split('&')[0].trim();
        let res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
        
        // Fallback: search just the first word (e.g. 'Dubai' instead of 'Dubai Luxury Escape')
        if (!res.data || res.data.length === 0) {
           const firstWord = query.split(' ')[0];
           res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(firstWord)}&format=json&limit=1`);
        }

        if (res.data && res.data.length > 0) {
          const lat = parseFloat(res.data[0].lat);
          const lng = parseFloat(res.data[0].lon);
          setCoords({ lat, lng });
          
          // Animate camera to the location after a slight delay for render
          setTimeout(() => {
            if (globeEl.current) {
              globeEl.current.pointOfView({ lat, lng, altitude: 1.5 }, 2000);
            }
          }, 500);
        } else {
          // Default to London if completely fails
          setCoords({ lat: 51.5074, lng: -0.1278 });
        }
      } catch (err) {
        console.error("Geocoding failed for globe:", err);
        setCoords({ lat: 51.5074, lng: -0.1278 });
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [currentTrip?.destination]);

  const handleSetOrigin = async (e) => {
    e.preventDefault();
    if (!originInput.trim()) return;
    setIsSearchingOrigin(true);
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(originInput.trim())}&format=json&limit=1`);
      if (res.data && res.data.length > 0) {
        setOriginCoords({
          lat: parseFloat(res.data[0].lat),
          lng: parseFloat(res.data[0].lon)
        });
      }
    } catch (err) {
      console.error("Geocoding failed for origin:", err);
    } finally {
      setIsSearchingOrigin(false);
      setOriginInput("");
    }
  };

  // Inject 3D Space Dust
  useEffect(() => {
    // Wait for Globe to initialize its scene
    const initSpaceDust = () => {
      if (globeEl.current && globeEl.current.scene) {
        const scene = globeEl.current.scene();
        
        // Prevent duplicate dust clouds in dev strict mode
        if (scene.children.some(c => c.name === 'spaceDust')) return;

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
          // Spread particles in a large sphere around the globe
          posArray[i] = (Math.random() - 0.5) * 800;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
          size: 1.2,
          color: 0x93c5fd, // Light blue dust
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        
        const spaceDust = new THREE.Points(particlesGeometry, particlesMaterial);
        spaceDust.name = 'spaceDust';
        scene.add(spaceDust);
      } else {
        setTimeout(initSpaceDust, 500);
      }
    };
    
    const initClouds = () => {
      if (globeEl.current && globeEl.current.scene) {
        const scene = globeEl.current.scene();
        if (scene.children.some(c => c.name === 'clouds')) return;

        const cloudGeometry = new THREE.SphereGeometry(100.6, 75, 75);
        new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-clouds10k.png', (texture) => {
          const cloudMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
          cloudMesh.name = 'clouds';
          scene.add(cloudMesh);

          const animateClouds = () => {
            cloudMesh.rotation.y += 0.0003;
            requestAnimationFrame(animateClouds);
          };
          animateClouds();
        });
      } else {
        setTimeout(initClouds, 500);
      }
    };
    
    initSpaceDust();
    initClouds();
  }, []);

  // Marker data
  const gData = coords ? [{
    lat: coords.lat,
    lng: coords.lng,
    size: 20,
    color: ['#60a5fa', '#3b82f6', '#1d4ed8', 'transparent'] // Blue glowing ripples
  }] : [];

  // Flight Path Arc Data
  const arcsData = coords ? [{
    startLat: originCoords.lat,
    startLng: originCoords.lng,
    endLat: coords.lat,
    endLng: coords.lng,
    color: ['rgba(56, 189, 248, 0)', 'rgba(56, 189, 248, 1)'] // Glowing sky blue arc
  }] : [];

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`relative flex flex-col h-[600px] rounded-[32px] overflow-hidden ios-glass-card group cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-10 ios-3d-element pointer-events-none">
        <div className="flex items-center gap-1.5 mb-1">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70 drop-shadow-md">Global Tracker</span>
        </div>
        <span className="text-2xl font-bold tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {currentTrip?.destination || "World Map"}
        </span>
      </div>

      {/* Origin Input Overlay */}
      <div className="absolute top-6 right-6 z-20">
        <form onSubmit={handleSetOrigin} className="flex items-center gap-2">
          <input
            type="text"
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            placeholder="Set Origin City..."
            className="w-40 h-8 px-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-colors backdrop-blur-md"
            disabled={isSearchingOrigin}
          />
          {isSearchingOrigin && <Loader2 className="w-4 h-4 text-white animate-spin" />}
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && !coords && (
        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin opacity-50" />
        </div>
      )}

      {/* The 3D Globe */}
      <div className="w-full h-full bg-[#030712] absolute inset-0 -z-10 flex items-center justify-center pt-8 overflow-hidden">
        <Globe
          ref={globeEl}
          width={globeSize.width} 
          height={globeSize.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          
          // Custom glowing atmosphere
          showAtmosphere={true}
          atmosphereColor="#60a5fa" 
          atmosphereAltitude={0.15}
          
          // Custom glowing ripples for destination
          ringsData={gData}
          ringColor={() => '#60a5fa'}
          ringMaxRadius="size"
          ringPropagationSpeed={3}
          ringRepeatPeriod={800}

          // Flight Path Animation
          arcsData={arcsData}
          arcColor={(d) => d.color}
          arcDashLength={0.5}
          arcDashGap={0.2}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={2000}
          arcAltitude={0.25}
          arcStroke={0.8}
        />
      </div>
      
      {/* Edge Gradients for depth */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
    </motion.div>
  );
};
