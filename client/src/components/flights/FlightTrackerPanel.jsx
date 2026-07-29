import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, PlaneTakeoff, PlaneLanding, DollarSign, Bell, Trash2, Plus, TrendingDown, TrendingUp, Loader2, Phone, Calendar, MapPin, X, Check, AlertTriangle } from 'lucide-react';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import api from '@/services/api';

const MOCK_ALERTS = [
  {
    _id: 'mock-1',
    origin: 'DEL',
    destination: 'NRT',
    departureDate: '2026-10-12',
    targetPrice: 450,
    currentPrice: 520,
    status: 'active',
    priceHistory: [580, 560, 540, 530, 520, 525, 510, 520],
    phone: '+91XXXXXXXXXX'
  },
  {
    _id: 'mock-2',
    origin: 'BOM',
    destination: 'DXB',
    departureDate: '2026-12-05',
    targetPrice: 200,
    currentPrice: 185,
    status: 'triggered',
    priceHistory: [250, 240, 230, 220, 210, 200, 190, 185],
    phone: '+91XXXXXXXXXX'
  }
];

export default function FlightTrackerPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const panelRef = useRef(null);
  
  // Use tilt effect for the panel container
  const { rotateX, rotateY } = useMouseTilt(panelRef, { maxTilt: 2, stiffness: 400, damping: 30 });

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    targetPrice: '',
    phone: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/flights/alerts');
      setAlerts(res.data);
    } catch (error) {
      console.warn('Failed to fetch alerts, using mock data:', error);
      setAlerts(MOCK_ALERTS);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const res = await api.post('/flights/alerts', formData);
      setAlerts([...alerts, res.data]);
      setFormData({ origin: '', destination: '', departureDate: '', targetPrice: '', phone: '' });
    } catch (error) {
      console.error('Failed to create alert:', error);
      // Simulate creation for mock data
      const newAlert = {
        _id: `mock-${Date.now()}`,
        ...formData,
        currentPrice: parseInt(formData.targetPrice) + 100,
        status: 'active',
        priceHistory: [parseInt(formData.targetPrice) + 100]
      };
      setAlerts([...alerts, newAlert]);
      setFormData({ origin: '', destination: '', departureDate: '', targetPrice: '', phone: '' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/flights/alerts/${id}`);
      setAlerts(alerts.filter(a => a._id !== id));
    } catch (error) {
      console.error('Failed to delete alert:', error);
      setAlerts(alerts.filter(a => a._id !== id));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={panelRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Create Form */}
      <motion.div 
        className="ios-glass-card rounded-[32px] p-6 lg:col-span-1"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-sky-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">New Alert</h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider pl-1">Origin</label>
              <div className="relative">
                <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  required
                  placeholder="DEL"
                  maxLength={3}
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value.toUpperCase()})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors uppercase"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider pl-1">Dest</label>
              <div className="relative">
                <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  required
                  placeholder="NRT"
                  maxLength={3}
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value.toUpperCase()})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors uppercase"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider pl-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider pl-1">Target Price (USD)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="number"
                required
                min="1"
                placeholder="400"
                value={formData.targetPrice}
                onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider pl-1">SMS Alert Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="tel"
                required
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full mt-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2"
          >
            {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create Alert
          </button>
        </form>
      </motion.div>

      {/* Active Alerts List */}
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <div className="h-full min-h-[300px] flex items-center justify-center ios-glass-card rounded-[32px]">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="h-full min-h-[300px] flex flex-col items-center justify-center ios-glass-card rounded-[32px] p-8 text-center border border-white/5"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-inner">
              <Plane className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Active Alerts</h3>
            <p className="text-white/40 max-w-sm">Set up a price alert to get notified via SMS when your dream flight drops in price.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <AnimatePresence>
              {alerts.map((alert) => {
                const isTriggered = alert.status === 'triggered';
                const trend = alert.currentPrice <= alert.targetPrice ? 'down' : 'up';
                
                return (
                  <motion.div
                    key={alert._id}
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className={`relative ios-glass-card rounded-[24px] p-5 overflow-hidden group ${isTriggered ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
                  >
                    {isTriggered && (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                    )}
                    
                    <div className="relative z-10 flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white tracking-widest">{alert.origin}</span>
                        <Plane className="w-4 h-4 text-white/30" />
                        <span className="text-lg font-bold text-white tracking-widest">{alert.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isTriggered ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'}`}>
                          {alert.status}
                        </div>
                        <button 
                          onClick={() => handleDelete(alert._id)}
                          className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-end justify-between mb-6">
                      <div>
                        <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">Current Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-light text-white">${alert.currentPrice}</span>
                          {trend === 'down' ? (
                            <TrendingDown className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1">Target</p>
                        <span className="text-lg font-medium text-white/80">${alert.targetPrice}</span>
                      </div>
                    </div>

                    {/* Mini Sparkline */}
                    <div className="relative z-10 h-8 flex items-end gap-1 opacity-70">
                      {alert.priceHistory && alert.priceHistory.map((price, i) => {
                        const min = Math.min(...alert.priceHistory);
                        const max = Math.max(...alert.priceHistory);
                        const range = max - min || 1;
                        const heightPct = ((price - min) / range) * 80 + 20; // 20% to 100%
                        
                        return (
                          <div 
                            key={i} 
                            className="flex-1 bg-white/20 rounded-t-sm transition-all duration-300 hover:bg-white/40"
                            style={{ height: `${heightPct}%` }}
                          />
                        )
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
