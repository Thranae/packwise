import React, { useState, useRef } from 'react';
import { User, Camera, Mail, Shield, CheckCircle2, Loader2, Plane, MapPin, Map, CalendarDays, Edit3, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getInitials } from '@/utils/formatters';
import * as userService from '@/services/user.service';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const userName = user?.name || 'Thranae';
  const userEmail = user?.email || 'hello@thranae.com';
  const profileImage = user?.profileImage;
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    displayName: user?.displayName || user?.name?.split(' ')[0] || '',
    email: user?.email || '',
    homeAirport: user?.homeAirport || '',
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
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await userService.uploadProfileImage(formData);
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
    <PageTransition className="col-span-12">
      <div className="w-full max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md mb-2"
          >
            Profile
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-medium text-white/60"
          >
            Manage your personal information, preferences, and account security.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Avatar & Quick Stats */}
          <motion.div variants={fadeInUp} className="lg:col-span-4 flex flex-col gap-8">
            <div className="ios-glass-card p-8 rounded-[32px] flex flex-col items-center text-center shadow-[0_24px_48px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] relative overflow-hidden group/card">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative group mb-6 z-10">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Rotating glow ring when uploading */}
                {isUploading && (
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 animate-[spin_2s_linear_infinite] blur-md opacity-70" />
                )}

                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] overflow-hidden cursor-pointer relative group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-2 border-white/20"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(userName)
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
                
                <button 
                  onClick={handleImageClick}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed z-20"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight drop-shadow-sm">{userName}</h2>
              <div className="flex items-center justify-center gap-1.5 text-sm text-white/60 mb-8 bg-white/5 py-1 px-3 rounded-full border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Traveler</span>
              </div>
              
              {/* Quick Stats */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-inner">
                      <Map className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-white/80">Trips Planned</span>
                  </div>
                  <span className="font-bold text-lg text-white">12</span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-inner">
                      <CalendarDays className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-white/80">Member Since</span>
                  </div>
                  <span className="font-bold text-white drop-shadow-md">Oct 2023</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Forms */}
          <motion.div variants={fadeInUp} className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Personal Details */}
            <div className="ios-glass-card p-8 md:p-10 rounded-[32px] relative overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]">
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  Personal Details
                </h3>
                
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-wait ${
                    isEditing 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:shadow-[0_0_16px_rgba(52,211,153,0.6)] hover:scale-105 border border-transparent' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {isEditing ? (isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />) : <Edit3 className="w-4 h-4" />}
                  {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Full Name */}
                  <div className="group/input relative">
                    <label className="block text-[13px] font-bold text-white/50 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within/input:text-blue-400">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-[16px] px-5 text-white font-medium focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed placeholder-white/30 shadow-inner"
                      />
                    </div>
                  </div>
                  
                  {/* Display Name */}
                  <div className="group/input relative">
                    <label className="block text-[13px] font-bold text-white/50 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within/input:text-purple-400">Display Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-[16px] px-5 text-white font-medium focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed placeholder-white/30 shadow-inner" 
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="group/input relative">
                  <label className="block text-[13px] font-bold text-white/50 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2 transition-colors group-focus-within/input:text-emerald-400">
                    Email Address
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 transition-colors group-focus-within/input:text-emerald-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-[16px] pl-14 pr-5 text-white font-medium focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed placeholder-white/30 shadow-inner" 
                    />
                  </div>
                </div>

                {/* Home Airport */}
                <div className="group/input relative">
                  <label className="block text-[13px] font-bold text-white/50 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within/input:text-blue-400">Home Airport (Optional)</label>
                  <div className="relative">
                    <Plane className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 transition-colors group-focus-within/input:text-blue-400" />
                    <input 
                      type="text" 
                      name="homeAirport"
                      value={formData.homeAirport}
                      onChange={handleInputChange}
                      placeholder="e.g. SFO, LHR, JFK"
                      disabled={!isEditing}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-[16px] pl-14 pr-5 text-white font-medium focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed placeholder-white/30 shadow-inner" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="ios-glass-card p-8 md:p-10 rounded-[32px] relative overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                Security
              </h3>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 p-6 rounded-[20px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Password</h4>
                  <p className="text-sm font-medium text-white/50">Last changed 3 months ago</p>
                </div>
                <button className="px-6 py-3 rounded-full ios-liquid-button text-sm font-bold text-white hover:scale-105 transition-transform shadow-md shrink-0 border border-white/10 bg-white/5">
                  Update Password
                </button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
