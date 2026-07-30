import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { LogoIcon, Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { loginSchema } from '@/constants/validation';
import api from '@/services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, setAuthData } = useAuth();
  const toast = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('packwise_remembered_email') ? true : false;
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: localStorage.getItem('packwise_remembered_email') || '', 
      password: '' 
    },
  });

  const onSubmit = async (data) => {
    let wakeTimer;
    try {
      if (rememberMe) {
        localStorage.setItem('packwise_remembered_email', data.email);
      } else {
        localStorage.removeItem('packwise_remembered_email');
      }
      
      // Free-tier backend cold starts take ~50s. Show a message if it takes >3s.
      wakeTimer = setTimeout(() => setIsWakingUp(true), 3000);
      
      await login(data);
      clearTimeout(wakeTimer);
      setIsWakingUp(false);
      navigate(ROUTES.OVERVIEW, { replace: true });
    } catch (error) {
      clearTimeout(wakeTimer);
      setIsWakingUp(false);
      toast.error(
        error.response?.data?.message || error.message || 'Invalid email or password.'
      );
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      let wakeTimer = setTimeout(() => setIsWakingUp(true), 3000);
      try {
        const res = await api.post('/auth/google', { tokenId: tokenResponse.access_token });
        const data = res.data;
        if (data.status === 'success') {
          // Manually set auth state to match standard login
          localStorage.setItem('token', data.data.token);
          setAuthData(data.data.user, data.data.token);
          clearTimeout(wakeTimer);
          setIsWakingUp(false);
          navigate(ROUTES.OVERVIEW, { replace: true });
        }
      } catch (error) {
        clearTimeout(wakeTimer);
        setIsWakingUp(false);
        console.error(error);
        toast.error('Google Sign-in failed. Please try again.');
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-in was cancelled or failed.');
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full flex flex-col font-sans"
    >
      {/* Real Top Logo */}
      <div className="mb-6 flex justify-start">
        <div className="hover:opacity-80 transition-opacity">
          <Logo size="md" onClick={() => navigate(ROUTES.HOME)} />
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mb-6">
        <h2 className="text-[28px] font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
          Welcome Back
        </h2>
        <p className="text-[15px] text-white/70 font-medium leading-relaxed">
          Sign in to continue your journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        
        {/* Email Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              {...register('email')}
              className={`w-full h-[50px] rounded-[16px] bg-white/5 border border-white/10 text-white pl-11 pr-4 text-[15px] font-medium placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-white/20 hover:bg-white/10 transition-all duration-300 ${errors.email ? '!border-red-500' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-white/50" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className={`w-full h-[50px] rounded-[16px] bg-white/5 border border-white/10 text-white pl-11 pr-12 text-[15px] font-medium placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-white/20 hover:bg-white/10 transition-all duration-300 ${errors.password ? '!border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400 pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mt-1 mb-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`relative w-4 h-4 rounded-[4px] border transition-colors flex items-center justify-center ${rememberMe ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' : 'border-[var(--theme-border-subtle)] bg-[var(--theme-bg-glass)] group-hover:border-[var(--color-accent)]'}`}>
              <input 
                type="checkbox" 
                className="opacity-0 absolute inset-0 cursor-pointer" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              {rememberMe && (
                <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white">
                  <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-[12px] font-medium text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)] transition-colors">Remember me</span>
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-[12px] font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary Button */}
        <button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className="w-full h-[52px] rounded-[16px] ios-liquid-button text-white text-[15px] font-bold flex items-center justify-center hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none mt-2"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isWakingUp ? 'Waking up server (can take 50s)...' : 'Logging in...'}</span>
            </div>
          ) : 'Continue'}
        </button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--theme-border-subtle)]"></div>
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className="px-2 bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] font-medium">or sign in with</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full h-[52px] rounded-[16px] bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[15px] font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-sm disabled:opacity-70 disabled:pointer-events-none"
        >
          {isGoogleLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isWakingUp ? 'Waking up server (can take 50s)...' : 'Connecting to Google...'}</span>
            </div>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-[13px] text-[var(--theme-text-secondary)]">
          Don't have an account?{' '}
          <Link to={ROUTES.SIGNUP} className="font-semibold text-[var(--theme-text-primary)] hover:text-[var(--color-accent)] transition-colors">
            Create Account &rarr;
          </Link>
        </p>
      </div>

      {/* Social Proof Widget */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center justify-center gap-3">
        <div className="flex -space-x-2 overflow-hidden drop-shadow-md">
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B1120] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User 1" />
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B1120] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="User 2" />
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B1120] object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop" alt="User 3" />
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B1120] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="User 4" />
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-[#0B1120] bg-white/10 backdrop-blur-md">
            <span className="text-[10px] font-bold text-white">+</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-3.5 h-3.5 text-yellow-500 fill-current drop-shadow-sm" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <span className="text-xs font-semibold text-white/70">Trusted by 10,000+ travelers</span>
        </div>
      </div>
    </motion.div>
  );
};

