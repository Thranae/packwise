import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
import Spline from '@splinetool/react-spline';
import { LogoIcon, Logo } from '@/components/ui/Logo';
import OtpInput from '@/components/ui/OtpInput';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { loginSchema } from '@/constants/validation';
import api from '@/services/api';
import axios from 'axios';

const isNative = Capacitor.isNativePlatform();

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

  // Forgot Password States
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(40);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isOtpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, resendTimer]);

  const [otpCode, setOtpCode] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
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
      
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage === 'Account does not exist. Please create an account.') {
        toast.error('Account does not exist. Redirecting to signup...', { duration: 4000 });
        setTimeout(() => navigate(ROUTES.SIGNUP), 2000);
      } else {
        toast.error(errorMessage || 'Invalid email or password.');
      }
    }
  };

  // Google login handler — only works on web/PWA
  const handleWebGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      let wakeTimer = setTimeout(() => setIsWakingUp(true), 3000);
      try {
        const res = await api.post('/auth/google', { tokenId: tokenResponse.access_token });
        const data = res.data;
        if (data.success) {
          localStorage.setItem('token', data.data.token);
          setAuthData(data.data.user, data.data.token);
          clearTimeout(wakeTimer);
          setIsWakingUp(false);
          navigate(ROUTES.OVERVIEW, { replace: true });
        } else {
          throw new Error(data.message || 'Login failed on backend');
        }
      } catch (error) {
        clearTimeout(wakeTimer);
        setIsWakingUp(false);
        console.error(error);
        toast.error(`Google Sign-in failed: ${error.message || 'Please try again.'}`);
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-in was cancelled or failed.');
    }
  });

  const handleNativeGoogleLogin = async () => {
    setIsGoogleLoading(true);
    let wakeTimer = setTimeout(() => setIsWakingUp(true), 3000);
    try {
      // Dynamic import to avoid SSR or Web breakages if plugin not present
      const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
      
      await GoogleAuth.initialize();
      const result = await GoogleAuth.signIn();
      const accessToken = result.authentication?.accessToken || result.accessToken;
      
      if (!accessToken) {
        throw new Error('Failed to get access token from Google.');
      }
      
      const res = await api.post('/auth/google', { tokenId: accessToken });
      const data = res.data;
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setAuthData(data.data.user, data.data.token);
        clearTimeout(wakeTimer);
        setIsWakingUp(false);
        navigate(ROUTES.OVERVIEW, { replace: true });
      } else {
        throw new Error(data.message || 'Login failed on backend');
      }
    } catch (error) {
      clearTimeout(wakeTimer);
      setIsWakingUp(false);
      console.error(error);
      toast.error(`Native Google Sign-in failed: ${error.message || JSON.stringify(error)}`);
      setIsGoogleLoading(false);
    }
  };

  const onGoogleClick = () => {
    const isActuallyNative = Capacitor.isNativePlatform();
    if (isActuallyNative) {
      handleNativeGoogleLogin();
    } else {
      handleWebGoogleLogin();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email.');
      return;
    }
    setIsOtpLoading(true);
    try {
      const res = await api.post(`/auth/forgot-password`, { email: forgotEmail });
      if (res.data?.success === true || res.data?.message) {
        setIsOtpSent(true);
        setResendTimer(40);
        toast.success('OTP sent! Please check your email.');
      } else {
        toast.error(res.data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Please ensure your account exists.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await api.post(`/auth/forgot-password`, { email: forgotEmail });
      if (res.data?.success === true || res.data?.message) {
        setResendTimer(40);
        toast.success('A new OTP has been sent to your email.');
      } else {
        toast.error(res.data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error('Please enter the OTP.');
      return;
    }
    setIsOtpLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: forgotEmail, otp: otpCode });
      if (res.data.success || res.data.status === 'success') {
        localStorage.setItem('token', res.data.data.token);
        setAuthData(res.data.data.user, res.data.data.token);
        toast.success('Login successful!');
        navigate(ROUTES.OVERVIEW, { replace: true });
      } else {
        toast.error(res.data.message || 'Failed to verify OTP.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsOtpLoading(false);
    }
  };

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
      <div className="mb-6 flex justify-between items-start">
        <div className="relative z-10 flex-1">
          <h2 className="text-[28px] font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
            Welcome Back
          </h2>
          <p className="text-[15px] text-white/70 font-medium leading-relaxed">
            Sign in to continue your journey.
          </p>
        </div>
      </div>

      {/* Form Area with AnimatePresence */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!isForgotPasswordMode ? (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)} 
              className="flex flex-col gap-3"
            >
              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50 drop-shadow-md" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    {...register('email')}
                    className={`w-full h-[50px] glass-input pl-11 pr-4 text-[15px] font-medium placeholder-white/40 transition-all duration-300 ${errors.email ? '!border-red-500' : ''}`}
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
                    <Lock className="h-5 w-5 text-white/50 drop-shadow-md" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    className={`w-full h-[50px] glass-input pl-11 pr-12 text-[15px] font-medium placeholder-white/40 transition-all duration-300 ${errors.password ? '!border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 drop-shadow-md" /> : <Eye className="h-5 w-5 drop-shadow-md" />}
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
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordMode(true)}
                  className="text-[12px] font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full h-[52px] rounded-[16px] primary-liquid-button text-white text-[15px] font-bold flex items-center justify-center mt-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isWakingUp ? 'Waking up server (can take 50s)...' : 'Logging in...'}</span>
                  </div>
                ) : 'Continue'}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}
              className="flex flex-col gap-3"
            >
              <div className="text-[14px] text-white/80 mb-2 font-medium">
                {isOtpSent 
                  ? 'Enter the 6-digit code sent to your email to sign in.' 
                  : 'Enter your email to receive a secure login code.'}
              </div>

              {!isOtpSent ? (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/50 drop-shadow-md" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full h-[50px] glass-input pl-11 pr-4 text-[15px] font-medium placeholder-white/40 transition-all duration-300"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <OtpInput length={6} value={otpCode} onChange={(val) => setOtpCode(val)} />
                </div>
              )}

              {isOtpSent && (
                <div className="flex justify-center mt-1 mb-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isResending}
                    className="text-[13px] font-medium text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isResending ? (
                      'Resending...'
                    ) : resendTimer > 0 ? (
                      `Resend code in ${resendTimer}s`
                    ) : (
                      'Didn\'t receive the code? Resend'
                    )}
                  </button>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordMode(false);
                    setIsOtpSent(false);
                    setOtpCode('');
                  }}
                  className="flex-1 h-[52px] rounded-[16px] ios-liquid-button text-white text-[15px] font-bold flex items-center justify-center transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOtpLoading}
                  className="flex-1 h-[52px] rounded-[16px] primary-liquid-button text-white text-[15px] font-bold flex items-center justify-center hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isOtpLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isOtpSent ? 'Sign In' : 'Send Code'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isForgotPasswordMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3 mt-3 overflow-hidden"
          >
            {/* Divider */}
            <div className="relative my-1">
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
              onClick={onGoogleClick}
              disabled={isGoogleLoading || isSubmitting}
              className="w-full h-[52px] rounded-[16px] ios-liquid-button text-white text-[15px] font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-sm disabled:opacity-70 disabled:pointer-events-none"
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
          </motion.div>
        )}
      </AnimatePresence>

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
