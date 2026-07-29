import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Diamond, Wallet, Car, Home, ChevronDown } from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

const CustomSelect = ({ name, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find(o => o.value == value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full bg-[#0f131d]/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-colors"
      >
        <span className="truncate pr-2">{selectedOption?.label || value}</span>
        <ChevronDown className={`shrink-0 w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: 'contain' }}
            className="absolute top-full left-0 right-0 mt-2 p-1 bg-[#131b2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] max-h-56 overflow-y-auto custom-scrollbar"
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setOpen(false);
                }}
                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                  value == opt.value ? 'bg-blue-500/20 text-blue-300 font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ConfigurationPanel = React.memo(({ inputs, setInputs, onCalculate }) => {
  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === 'days' || name === 'travelers' ? Number(value) : value,
    }));
  }, [setInputs]);

  const Field = ({ label, icon: Icon, iconColor = 'text-white/30', children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
        <Icon className={`w-3 h-3 ${iconColor}`} />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="w-full ios-glass-card rounded-[32px] p-6 relative z-10">
      {/* Top row — 4 fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Field label="Home Country" icon={MapPin}>
          <CustomSelect 
            name="originCountry" 
            value={inputs.originCountry} 
            onChange={handleChange} 
            options={[
              { value: 'India', label: 'India' },
              { value: 'United States', label: 'United States' },
              { value: 'United Kingdom', label: 'United Kingdom' }
            ]} 
          />
        </Field>

        <Field label="Destination" icon={MapPin} iconColor="text-blue-400">
          <CustomSelect 
            name="destCountry" 
            value={inputs.destCountry} 
            onChange={handleChange} 
            options={Object.keys(COUNTRY_DATA).map(c => ({ value: c, label: c }))} 
          />
        </Field>

        <Field label="Duration" icon={Calendar}>
          <CustomSelect 
            name="days" 
            value={inputs.days} 
            onChange={handleChange} 
            options={[3,5,7,10,14,21,30].map(d => ({ value: d, label: `${d} Days` }))} 
          />
        </Field>

        <Field label="Travelers" icon={Users}>
          <CustomSelect 
            name="travelers" 
            value={inputs.travelers} 
            onChange={handleChange} 
            options={[1,2,3,4,5,6].map(t => ({ value: t, label: `${t} ${t === 1 ? 'Adult' : 'Adults'}` }))} 
          />
        </Field>
      </div>

      {/* Bottom row — 3 preference fields + button */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <Field label="Travel Style" icon={Diamond} iconColor="text-purple-400">
          <CustomSelect 
            name="travelStyle" 
            value={inputs.travelStyle} 
            onChange={handleChange} 
            options={[
              { value: 'budget', label: 'Budget' },
              { value: 'standard', label: 'Standard' },
              { value: 'luxury', label: 'Luxury' }
            ]} 
          />
        </Field>

        <Field label="Transportation" icon={Car} iconColor="text-blue-400">
          <CustomSelect 
            name="transportation" 
            value={inputs.transportation || 'public'} 
            onChange={handleChange} 
            options={[
              { value: 'public', label: 'Public Transit' },
              { value: 'rideshare', label: 'Taxi / Rideshare' },
              { value: 'rental', label: 'Car Rental' }
            ]} 
          />
        </Field>

        <Field label="Accommodation" icon={Home} iconColor="text-amber-400">
          <CustomSelect 
            name="accommodation" 
            value={inputs.accommodation || 'hotel'} 
            onChange={handleChange} 
            options={[
              { value: 'hostel', label: 'Hostel / Dorm' },
              { value: 'hotel', label: 'Standard Hotel' },
              { value: 'airbnb', label: 'Airbnb' },
              { value: 'resort', label: 'Luxury Resort' }
            ]} 
          />
        </Field>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCalculate}
          className="h-[42px] w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
        >
          Calculate Budget
        </motion.button>
      </div>
    </div>
  );
});
