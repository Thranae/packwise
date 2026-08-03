import React, { useState, useRef } from 'react';
import { User, Camera, Mail, Shield, CheckCircle2, Loader2, Plane, MapPin, Map, CalendarDays, Edit3, Save, Compass, DollarSign, Utensils, Mountain, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';

const glassBase = "bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.4)]";
const glassRadius = "rounded-[32px]";
const glassStyle = `${glassBase} ${glassRadius}`;
const glassPill = `${glassBase} rounded-full`;
const glassHover = "transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] hover:-translate-y-1 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2),0_12px_24px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.15)] cursor-pointer";
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
    displayName: user?.displayName || user?.name?.split(' ')[0] || '',
    email: user?.email || '',
    homeAirport: user?.homeAirport || '',
    dietaryRestrictions: user?.dietaryRestrictions || [],
    budgetPreference: user?.budgetPreference || 'moderate',
    travelStyle: user?.travelStyle || [],
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
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-[#020617] min-h-screen text-white overflow-x-hidden font-sans selection:bg-white/20 selection:text-white transition-colors duration-700">
      <AnimatedBackground />
      <PageTransition className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-20">
        <main className="max-w-3xl mx-auto">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center justify-center space-y-3 mb-6">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden neon-glow p-1 bg-gradient-to-br from-[#a078ff]/30 to-[#4cd7f6]/30 cursor-pointer group ios-3d-element" onClick={handleImageClick}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {profileImage ? (
              <img alt="Profile Avatar" className="w-full h-full object-cover rounded-full" src={profileImage} />
            ) : (
              <div className="w-full h-full bg-[#1d2022] rounded-full flex items-center justify-center text-3xl font-bold text-white">
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
          
          <div className="text-center space-y-1">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{userName}</h2>
            <p className="text-base text-white/60">{userEmail}</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 mt-2 ${glassPill} ${
              isEditing ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'btn-primary text-white'
            }`}
          >
            {isEditing ? (isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />) : <Edit3 className="w-4 h-4" />}
            {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
          </button>
        </section>

        {/* Dynamic Forms/Preferences Section */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
          
          {/* Form fields (Only visible when editing for a minimal look, or disabled view) */}
          <motion.section variants={fadeInUp} className="space-y-4">
            <h3 className="text-xs font-bold text-[#4cd7f6] uppercase tracking-widest pl-2">Personal Details</h3>
            <div className={`\${glassStyle} \${glassHover} p-4 grid grid-cols-1 md:grid-cols-2 gap-4`}>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing}
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} disabled={!isEditing}
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing}
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Home Airport</label>
                <div className="relative">
                  <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" name="homeAirport" value={formData.homeAirport} onChange={handleInputChange} disabled={!isEditing} placeholder="e.g. SFO"
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

            </div>
          </motion.section>

          {/* Travel Preferences Bento Grid */}
          <motion.section variants={fadeInUp} className="space-y-4">
            <h3 className="text-xs font-bold text-[#4cd7f6] uppercase tracking-widest pl-2">Travel Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Budget */}
              <div className={`\${glassStyle} \${glassHover} p-4 flex flex-col gap-3`}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase">Budget</p>
                    <p className="text-base text-white font-medium capitalize">{formData.budgetPreference}</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    {['budget', 'moderate', 'luxury'].map(b => (
                      <button key={b} onClick={() => togglePreference('budgetPreference', b)} className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all ${glassPill} ${formData.budgetPreference === b ? 'bg-[#4cd7f6]/20 border border-[#4cd7f6]/50 text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.3)]' : 'border-transparent text-white/70'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 2: Travel Style */}
              <div className={`\${glassStyle} \${glassHover} p-4 flex flex-col gap-3`}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-full bg-[#a078ff]/10 text-[#a078ff]">
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase">Travel Style</p>
                    <p className="text-base text-white font-medium">{formData.travelStyle.length > 0 ? formData.travelStyle.join(', ') : 'None selected'}</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {STYLE_OPTIONS.map(style => {
                      const isSelected = formData.travelStyle.includes(style);
                      return (
                        <button key={style} onClick={() => togglePreference('travelStyle', style)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${glassPill} ${isSelected ? 'bg-[#a078ff]/20 border border-[#a078ff]/50 text-[#a078ff] shadow-[0_0_10px_rgba(160,120,255,0.3)]' : 'border-transparent text-white/70'}`}>
                          {style}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card 3: Dietary Restrictions */}
              <div className={`\${glassStyle} \${glassHover} p-4 flex flex-col gap-3 md:col-span-2`}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-full bg-orange-500/10 text-orange-400">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase">Dietary Restrictions</p>
                    <p className="text-base text-white font-medium">{formData.dietaryRestrictions.length > 0 ? formData.dietaryRestrictions.join(', ') : 'None selected'}</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DIETARY_OPTIONS.map(diet => {
                      const isSelected = formData.dietaryRestrictions.includes(diet);
                      return (
                        <button key={diet} onClick={() => togglePreference('dietaryRestrictions', diet)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${glassPill} ${isSelected ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'border-transparent text-white/70'}`}>
                          {diet}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </motion.section>
        </motion.div>
      </main>
      </PageTransition>
    </div>
  );
}
