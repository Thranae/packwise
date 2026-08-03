import React, { useState, useRef } from 'react';
import { User, Camera, Mail, Shield, CheckCircle2, Loader2, Plane, MapPin, Map, CalendarDays, Edit3, Save, Compass, DollarSign, Utensils, Mountain, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
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
    <PageTransition className="col-span-12 relative min-h-screen">
      {/* Ambient Mesh Background */}
      <div className="fixed inset-0 mesh-bg z-[-1] pointer-events-none w-full h-full object-cover"></div>

      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-32">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center justify-center space-y-6 mb-20">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden neon-glow p-1 bg-gradient-to-br from-[#a078ff]/30 to-[#4cd7f6]/30 cursor-pointer group" onClick={handleImageClick}>
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
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{userName}</h2>
            <p className="text-lg text-white/60">{userEmail}</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 ${
              isEditing ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'btn-primary text-white'
            }`}
          >
            {isEditing ? (isSaving ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Save className="w-[18px] h-[18px]" />) : <Edit3 className="w-[18px] h-[18px]" />}
            {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
          </button>
        </section>

        {/* Dynamic Forms/Preferences Section */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-12">
          
          {/* Form fields (Only visible when editing for a minimal look, or disabled view) */}
          <motion.section variants={fadeInUp} className="space-y-6">
            <h3 className="text-sm font-bold text-[#4cd7f6] uppercase tracking-widest pl-2">Personal Details</h3>
            <div className="liquid-card rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} disabled={!isEditing}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Home Airport</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" name="homeAirport" value={formData.homeAirport} onChange={handleInputChange} disabled={!isEditing} placeholder="e.g. SFO"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-[#a078ff] focus:bg-white/10 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

            </div>
          </motion.section>

          {/* Travel Preferences Bento Grid */}
          <motion.section variants={fadeInUp} className="space-y-6">
            <h3 className="text-sm font-bold text-[#4cd7f6] uppercase tracking-widest pl-2">Travel Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Budget */}
              <div className="liquid-card rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase">Budget</p>
                    <p className="text-lg text-white font-medium capitalize">{formData.budgetPreference}</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    {['budget', 'moderate', 'luxury'].map(b => (
                      <button key={b} onClick={() => togglePreference('budgetPreference', b)} className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${formData.budgetPreference === b ? 'bg-[#4cd7f6]/20 border-[#4cd7f6]/50 text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.3)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 2: Travel Style */}
              <div className="liquid-card rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-full bg-[#a078ff]/10 text-[#a078ff]">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase">Travel Style</p>
                    <p className="text-lg text-white font-medium">{formData.travelStyle.length > 0 ? formData.travelStyle.join(', ') : 'None selected'}</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {STYLE_OPTIONS.map(style => {
                      const isSelected = formData.travelStyle.includes(style);
                      return (
                        <button key={style} onClick={() => togglePreference('travelStyle', style)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isSelected ? 'bg-[#a078ff]/20 border-[#a078ff]/50 text-[#a078ff] shadow-[0_0_10px_rgba(160,120,255,0.3)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                          {style}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card 3: Dietary Restrictions */}
              <div className="liquid-card rounded-3xl p-6 flex flex-col gap-4 md:col-span-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-full bg-orange-500/10 text-orange-400">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase">Dietary Restrictions</p>
                    <p className="text-lg text-white font-medium">{formData.dietaryRestrictions.length > 0 ? formData.dietaryRestrictions.join(', ') : 'None selected'}</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DIETARY_OPTIONS.map(diet => {
                      const isSelected = formData.dietaryRestrictions.includes(diet);
                      return (
                        <button key={diet} onClick={() => togglePreference('dietaryRestrictions', diet)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isSelected ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
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
  );
}
