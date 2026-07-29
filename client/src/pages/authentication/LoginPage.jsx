import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { LogoIcon } from '@/components/ui/Logo';
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
    try {
      if (rememberMe) {
        localStorage.setItem('packwise_remembered_email', data.email);
      } else {
        localStorage.removeItem('packwise_remembered_email');
      }
      await login(data);
      navigate(ROUTES.OVERVIEW, { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Invalid email or password.'
      );
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const res = await api.post('/auth/google', { tokenId: tokenResponse.access_token });
        const data = res.data;
        if (data.status === 'success') {
          // Manually set auth state to match standard login
          localStorage.setItem('token', data.data.token);
          setAuthData(data.data.user, data.data.token);
          navigate(ROUTES.OVERVIEW, { replace: true });
        }
      } catch (error) {
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
      <div className="mb-3 flex justify-start">
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 shadow-sm">
          <LogoIcon size="lg" className="text-[var(--color-accent)]" />
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mb-5">
        <h2 className="text-[24px] font-bold text-[var(--theme-text-primary)] tracking-tight mb-1">
          Welcome Back
        </h2>
        <p className="text-[14px] text-[var(--theme-text-secondary)] font-light leading-relaxed">
          Sign in to continue your journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        
        {/* Email Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-[var(--theme-text-secondary)] opacity-70" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              {...register('email')}
              className={`w-full h-[46px] glass-input pl-10 pr-4 text-[14px] font-medium placeholder-[var(--theme-text-secondary)] transition-all ${errors.email ? '!border-red-500' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[var(--theme-text-secondary)] opacity-70" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className={`w-full h-[46px] glass-input pl-10 pr-10 text-[14px] font-medium placeholder-[var(--theme-text-secondary)] transition-all ${errors.password ? '!border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4 opacity-70" /> : <Eye className="h-4 w-4 opacity-70" />}
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
          className="w-full h-[46px] rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[14px] font-semibold flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none mt-1"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
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
          className="w-full h-[46px] rounded-[14px] glass-card text-[var(--theme-text-primary)] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[var(--theme-bg-surface)] transition-all duration-300 shadow-sm disabled:opacity-70 disabled:pointer-events-none"
        >
          {isGoogleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
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
    </motion.div>
  );
};

