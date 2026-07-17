import React from 'react';
import { MapPin, Calendar, Users, Diamond, Wallet, Car, Home } from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

export const ConfigurationPanel = ({ inputs, setInputs, onCalculate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === 'days' || name === 'travelers' ? Number(value) : value,
    }));
  };

  return (
    <div className="sticky top-8 bg-[#121826] border border-white/5 rounded-2xl p-6 flex flex-col gap-6 shadow-sm overflow-y-auto custom-scrollbar max-h-[calc(100vh-4rem)]">
      
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-lg font-bold text-white tracking-tight">Trip Configuration</h2>
        <p className="text-[11px] text-white/50 font-medium">Set parameters for AI calculation</p>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        
        {/* Origin & Destination */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Home Country</label>
            <div className="relative">
              <select name="originCountry" value={inputs.originCountry} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3 text-blue-400"/> Destination Country</label>
            <div className="relative">
              <select name="destCountry" value={inputs.destCountry} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
                {Object.keys(COUNTRY_DATA).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/5" />

        {/* Date & People */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3"/> Duration</label>
            <select name="days" value={inputs.days} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
              {[3, 5, 7, 10, 14, 21, 30].map(d => (
                <option key={d} value={d}>{d} Days</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-3 h-3"/> Travelers</label>
            <select name="travelers" value={inputs.travelers} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
              {[1, 2, 3, 4, 5, 6, 8, 10].map(t => (
                <option key={t} value={t}>{t} {t === 1 ? 'Adult' : 'Adults'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full h-px bg-white/5" />

        {/* Preferences */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Diamond className="w-3 h-3 text-purple-400"/> Travel Style</label>
            <select name="travelStyle" value={inputs.travelStyle} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
              <option value="budget">Backpacker / Budget</option>
              <option value="standard">Standard / Comfort</option>
              <option value="luxury">Luxury / Premium</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Wallet className="w-3 h-3 text-emerald-400"/> Budget Type</label>
            <select name="budgetType" value={inputs.budgetType || 'balanced'} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
              <option value="strict">Strict (Minimize costs)</option>
              <option value="balanced">Balanced (Value for money)</option>
              <option value="flexible">Flexible (Comfort first)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Car className="w-3 h-3 text-blue-400"/> Transportation</label>
            <select name="transportation" value={inputs.transportation || 'public'} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
              <option value="public">Public Transit</option>
              <option value="rideshare">Taxi / Rideshare</option>
              <option value="rental">Car Rental</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Home className="w-3 h-3 text-amber-400"/> Accommodation</label>
            <select name="accommodation" value={inputs.accommodation || 'hotel'} onChange={handleChange} className="w-full bg-[#1A202C] border border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-white appearance-none outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
              <option value="hostel">Hostel / Dorm</option>
              <option value="hotel">Standard Hotel</option>
              <option value="airbnb">Airbnb / Apartment</option>
              <option value="resort">Luxury Resort</option>
            </select>
          </div>
        </div>
        
      </div>

      <button onClick={onCalculate} className="w-full py-4 mt-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]">
        Calculate Budget
      </button>

    </div>
  );
};
