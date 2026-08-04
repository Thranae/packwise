import React, { useState, useRef } from 'react';
import { User, Camera, Mail, Plane, Save, Edit3, DollarSign, Utensils, Mountain, Leaf, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { getInitials } from '@/utils/formatters';
import * as userService from '@/services/user.service';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const { playSound } = useSoundEffect();
  const userName = user?.name || 'Julian Rivers';
  const userEmail = user?.email || 'julian.rivers@voyage.elite';
  const profileImage = user?.profileImage;
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    displayName: user?.displayName || '',
    email: user?.email || '',
    homeAirport: user?.homeAirport || '',
    dietaryRestrictions: user?.dietaryRestrictions || [],
    travelStyles: user?.travelStyles || user?.travelPreferences?.styles || [],
    budgetPreference: user?.budgetPreference || user?.travelPreferences?.budget || 'Moderate',
    currency: user?.currency || 'USD'
  });

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please select an image file');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size must be less than 5MB');
    }

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append('profileImage', file);

      const response = await userService.uploadProfileImage(data);
      if (response.success && response.data) {
        updateUser({ profileImage: response.data.profileImage });
        toast.success('Profile image updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setIsSaving(true);
      const response = await userService.updateProfile(formData);
      if (response.success && response.data) {
        updateUser(response.data);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePreference = async (type, value) => {
    if (!isEditing) {
      toast.info('Click "Edit Profile" to change preferences');
      return;
    }
    playSound('tap');
    
    let newValue;
    if (type === 'budgetPreference') {
      newValue = value;
    } else {
      const currentList = formData[type] || [];
      const index = currentList.indexOf(value);
      if (index === -1) {
        newValue = [...currentList, value];
      } else {
        newValue = currentList.filter(item => item !== value);
      }
    }

    setFormData(prev => ({ ...prev, [type]: newValue }));

    try {
      const response = await userService.updateProfile({ ...formData, [type]: newValue });
      if (response.success && response.data) {
        updateUser(response.data);
        playSound('success');
      }
    } catch (error) {
      setFormData(prev => ({ ...prev, [type]: formData[type] }));
      toast.error('Failed to save preference');
    }
  };

  const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Nut Allergy', 'Dairy-Free'];
  const STYLE_OPTIONS = ['Adventure', 'Relaxation', 'Culture', 'Nightlife', 'Food', 'Nature', 'Shopping'];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="text-white font-sans selection:bg-white/20 selection:text-white transition-colors duration-700 w-full">
      <PageTransition className="relative z-10 w-full max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-8">
        <main className="w-full">
          
          {/* Top Header / Sticky Bar */}
          <div className="flex flex-row items-center justify-between gap-2 mb-6 sm:mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">My Profile</h1>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2 ${
                isEditing 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-[0_4px_16px_rgba(34,197,94,0.4)] border border-green-400/50' 
                  : 'ios-liquid-button bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md shadow-md'
              }`}
            >
              {isEditing ? (isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />) : <Edit3 className="w-4 h-4" />}
              {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Avatar & Basic Info */}
            <section className="lg:col-span-1 flex flex-col gap-6">
              <div className="ios-glass-card rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-lg border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                
                <div className="relative w-28 h-28 rounded-full overflow-hidden neon-glow p-1 bg-gradient-to-br from-[#a078ff]/40 to-[#4cd7f6]/40 cursor-pointer group ios-3d-element mb-4 mt-2" onClick={handleImageClick}>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  {profileImage ? (
                    <img alt="Profile Avatar" className="w-full h-full object-cover rounded-full border-2 border-[#020617]" src={profileImage} referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-[#1d2022] rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-[#020617]">
                      {getInitials(userName)}
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-1 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-full z-20">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-1 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full z-10">
                    <Camera className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-extrabold tracking-tight text-white mb-1">{userName}</h2>
                <p className="text-sm text-white/60 mb-2">{userEmail}</p>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold rounded-full tracking-wider border border-blue-500/30">
                  Elite Traveler
                </div>
              </div>
            </section>

            {/* Right Column: Forms & Preferences */}
            <motion.section variants={staggerContainer} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">
              
              {/* Personal Details */}
              <motion.div variants={fadeInUp} className="ios-glass-card rounded-[24px] p-5 border border-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#4cd7f6]/5 blur-[60px] rounded-full pointer-events-none"></div>
                <h3 className="text-[11px] font-bold text-[#4cd7f6] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider pl-1">Full Name</label>
                    <div className="relative w-full h-11">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-white/40" />
                      </div>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing}
                        className="glass-input w-full h-full pl-9 pr-3 text-sm disabled:opacity-60 disabled:bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider pl-1">Display Name</label>
                    <div className="relative w-full h-11">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-white/40" />
                      </div>
                      <input 
                        type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} disabled={!isEditing}
                        className="glass-input w-full h-full pl-9 pr-3 text-sm disabled:opacity-60 disabled:bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider pl-1">Email Address</label>
                    <div className="relative w-full h-11">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-white/40" />
                      </div>
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing}
                        className="glass-input w-full h-full pl-9 pr-3 text-sm disabled:opacity-60 disabled:bg-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider pl-1">Home Airport</label>
                    <div className="relative w-full h-11">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Plane className="w-4 h-4 text-white/40" />
                      </div>
                      <input 
                        type="text" name="homeAirport" value={formData.homeAirport} onChange={handleInputChange} disabled={!isEditing} placeholder="e.g. SFO"
                        className="glass-input uppercase w-full h-full pl-9 pr-3 text-sm disabled:opacity-60 disabled:bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Travel Preferences */}
              <motion.div variants={fadeInUp} className="ios-glass-card rounded-[24px] p-5 border border-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#a078ff]/5 blur-[60px] rounded-full pointer-events-none"></div>
                <h3 className="text-[11px] font-bold text-[#a078ff] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Mountain className="w-4 h-4" /> Travel Preferences
                </h3>
                
                <div className="space-y-5">
                  {/* Budget */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <p className="text-[11px] font-bold text-white/70 uppercase">Budget</p>
                      {!isEditing && <span className="ml-auto text-sm font-medium text-white capitalize">{formData.budgetPreference}</span>}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 mt-3">
                        {['budget', 'moderate', 'luxury'].map(b => (
                          <button key={b} onClick={() => togglePreference('budgetPreference', b)} className={`flex-1 py-2 rounded-xl text-[11px] font-bold capitalize transition-all ${formData.budgetPreference === b ? 'ios-liquid-button bg-blue-500 text-white shadow-[0_2px_10px_rgba(59,130,246,0.4)]' : 'ios-glass-pill bg-white/10 text-white/60 hover:bg-white/20'}`}>
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Travel Style */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <Mountain className="w-4 h-4" />
                      </div>
                      <p className="text-[11px] font-bold text-white/70 uppercase">Travel Style</p>
                      {!isEditing && <span className="ml-auto text-sm font-medium text-white text-right">{formData.travelStyles?.length > 0 ? formData.travelStyles.join(', ') : 'None'}</span>}
                    </div>
                    {isEditing && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {STYLE_OPTIONS.map(style => {
                          const isSelected = formData.travelStyles?.includes(style);
                          return (
                            <button key={style} onClick={() => togglePreference('travelStyles', style)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${isSelected ? 'ios-liquid-button bg-purple-500 text-white shadow-[0_2px_10px_rgba(168,85,247,0.4)]' : 'ios-glass-pill bg-white/10 text-white/60 hover:bg-white/20'}`}>
                              {style}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dietary Restrictions */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <p className="text-[11px] font-bold text-white/70 uppercase">Dietary Restrictions</p>
                      {!isEditing && <span className="ml-auto text-sm font-medium text-white text-right">{formData.dietaryRestrictions.length > 0 ? formData.dietaryRestrictions.join(', ') : 'None'}</span>}
                    </div>
                    {isEditing && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {DIETARY_OPTIONS.map(diet => {
                          const isSelected = formData.dietaryRestrictions.includes(diet);
                          return (
                            <button key={diet} onClick={() => togglePreference('dietaryRestrictions', diet)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${isSelected ? 'ios-liquid-button bg-orange-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.4)]' : 'ios-glass-pill bg-white/10 text-white/60 hover:bg-white/20'}`}>
                              {diet}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.section>
          </div>

        </main>
      </PageTransition>
    </div>
  );
}
