const fs = require('fs');

// --- 1. Fix TripsPage useLocation Error ---
let tripsContent = fs.readFileSync('src/pages/trips/TripsPage.jsx', 'utf-8');
tripsContent = tripsContent.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link, useLocation } from 'react-router-dom';"
);
fs.writeFileSync('src/pages/trips/TripsPage.jsx', tripsContent);
console.log("Fixed useLocation import in TripsPage.");

// --- 2. Add iOS 26 Liquid Glass & 3D Texture to Home Page Trip Card ---
let homeContent = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// Replace the outer container of the trip card to add noise texture, extreme liquid glass, and 3D inner shadows
const oldOuter = '<div className="relative p-[1px] rounded-[32px] overflow-hidden bg-gradient-to-br from-white/40 via-white/10 to-transparent shadow-[0_32px_64px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-[24px]">';
const newOuter = `<div className="relative p-[1.5px] rounded-[32px] bg-gradient-to-br from-white/50 via-white/10 to-black/20 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,255,255,0.5),inset_0_-2px_10px_rgba(0,0,0,0.3)] backdrop-blur-[40px] transform-gpu preserve-3d overflow-hidden">
                        {/* iOS Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                        
                        {/* 3D Liquid Glare Sheen */}
                        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent opacity-60 rounded-t-[32px] z-0 pointer-events-none" />
                        
                        {/* Vibrant Ambient Orbs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/30 blur-[40px] rounded-full animate-pulse z-0" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/30 blur-[40px] rounded-full animate-pulse z-0" style={{ animationDelay: "1s" }} />`;

homeContent = homeContent.replace(oldOuter, newOuter);

// Replace the inner content container to sit above the new layers
const oldInner = '<div className="bg-[#030712]/40 backdrop-blur-3xl rounded-[32px] p-2 flex flex-col gap-2 relative overflow-hidden border border-white/5">';
const newInner = '<div className="bg-[#030712]/30 rounded-[31px] p-2.5 flex flex-col gap-3 relative z-10 overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">';
homeContent = homeContent.replace(oldInner, newInner);

// Enhance the image wrapper with a 3D inner shadow and rounding
const oldImgWrap = '<div className="w-full h-[140px] sm:h-[160px] rounded-[28px] overflow-hidden relative border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] shrink-0 group">';
const newImgWrap = '<div className="w-full h-[150px] sm:h-[170px] rounded-[24px] overflow-hidden relative shadow-[inset_0_2px_15px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.4)] shrink-0 group transform-gpu z-10 border border-white/10">';
homeContent = homeContent.replace(oldImgWrap, newImgWrap);

// Make the "View Itinerary" button match the liquid aesthetic
const oldBtn = '<button className="w-full bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 backdrop-blur-md rounded-[20px] py-3.5 px-4 text-white font-semibold flex justify-center items-center gap-2 transition-all duration-300 shadow-lg">';
const newBtn = '<button className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 backdrop-blur-xl rounded-[20px] py-3.5 px-4 text-white font-semibold flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-[0.98] group relative overflow-hidden"><div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />';
homeContent = homeContent.replace(oldBtn, newBtn);

fs.writeFileSync('src/pages/HomePage.jsx', homeContent);
console.log("Added 3D Liquid Glass iOS 26 effect to Home Page Trip Card.");
