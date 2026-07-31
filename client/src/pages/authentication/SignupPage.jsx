import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
import { LogoIcon, Logo } from '@/components/ui/Logo';
import OtpInput from '@/components/ui/OtpInput';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { signupSchema } from '@/constants/validation';
import api from '@/services/api';
import axios from 'axios';

const isNative = Capacitor.isNativePlatform();

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, setAuthData } = useAuth();
  const toast = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  
  // OTP Verification States
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(40);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isOtpMode && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpMode, resendTimer]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      let wakeTimer = setTimeout(() => setIsWakingUp(true), 3000);
      const vercelApiUrl = import.meta.env.VITE_VERCEL_URL || (window.location.origin.includes('localhost') ? '' : window.location.origin);
      const res = await axios.post(`${vercelApiUrl}/api/signup`, data);
      
      if (res.data.success || res.status === 201) {
        setSignupEmail(data.email);
        setIsOtpMode(true);
        setResendTimer(40); // Start timer when entering OTP mode
        toast.success(res.data.message || 'OTP sent! Please check your email to verify.');
      } else {
        toast.error(res.data.message || 'Failed to send OTP.');
      }
      
      clearTimeout(wakeTimer);
      setIsWakingUp(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'An error occurred during signup.'
      );
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    try {
      // Re-trigger the signup API to resend the OTP.
      const data = getValues();
      const vercelApiUrl = import.meta.env.VITE_VERCEL_URL || (window.location.origin.includes('localhost') ? '' : window.location.origin);
      const res = await axios.post(`${vercelApiUrl}/api/signup`, data);
      
      if (res.data.success || res.status === 201) {
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
          throw new Error(data.message || 'Signup failed on backend');
        }
      } catch (error) {
        clearTimeout(wakeTimer);
        setIsWakingUp(false);
        console.error(error);
        toast.error('Google Sign-up failed. Please try again.');
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-up was cancelled or failed.');
    }
  });

  const handleNativeGoogleLogin = async () => {
    setIsGoogleLoading(true);
    let wakeTimer = setTimeout(() => setIsWakingUp(true), 3000);
    try {
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
        throw new Error(data.message || 'Signup failed on backend');
      }
    } catch (error) {
      clearTimeout(wakeTimer);
      setIsWakingUp(false);
      console.error(error);
      toast.error('Native Google Sign-up failed. Please ensure you configured the Android Client ID.');
      setIsGoogleLoading(false);
    }
  };

  const onGoogleClick = () => {
    if (isNative) {
      handleNativeGoogleLogin();
    } else {
      handleWebGoogleLogin();
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
      <div className="mb-6">
        <h2 className="text-[28px] font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
          Create Account
        </h2>
        <p className="text-[15px] text-white/70 font-medium leading-relaxed">
          Start your journey with Voyage Genie today.
        </p>
      </div>

      {/* Form Area with AnimatePresence */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!isOtpMode ? (
            <motion.form 
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)} 
              className="flex flex-col gap-3"
            >
              
              {/* Name Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register('name')}
                    className={`w-full h-[50px] rounded-[16px] bg-white/5 border border-white/10 text-white pl-11 pr-4 text-[15px] font-medium placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-white/20 hover:bg-white/10 transition-all duration-300 ${errors.name ? '!border-red-500' : ''}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400 pl-1">{errors.name.message}</p>
                )}
              </div>

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
              <div className="flex gap-3">
                <div className="w-1/2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/50" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...register('password')}
                      className={`w-full h-[50px] rounded-[16px] bg-white/5 border border-white/10 text-white pl-11 pr-10 text-[15px] font-medium placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-white/20 hover:bg-white/10 transition-all duration-300 ${errors.password ? '!border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400 pl-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="w-1/2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/50" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm"
                      {...register('confirmPassword')}
                      className={`w-full h-[50px] rounded-[16px] bg-white/5 border border-white/10 text-white pl-11 pr-10 text-[15px] font-medium placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-white/20 hover:bg-white/10 transition-all duration-300 ${errors.confirmPassword ? '!border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
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
                    <span>{isWakingUp ? 'Waking up server (can take 50s)...' : 'Creating account...'}</span>
                  </div>
                ) : 'Create Account'}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="verify-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleVerifySignupOtp}
              className="flex flex-col gap-3"
            >
              <div className="text-[14px] text-white/80 mb-2 font-medium">
                We sent a 6-digit verification code to <strong>{signupEmail}</strong>. Please enter it to verify your account.
              </div>

              <div>
                <OtpInput length={6} value={otpCode} onChange={(val) => setOtpCode(val)} />
              </div>

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

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpMode(false);
                    setOtpCode('');
                  }}
                  className="flex-1 h-[52px] rounded-[16px] bg-white/5 border border-white/10 text-white text-[15px] font-bold flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isOtpLoading}
                  className="flex-1 h-[52px] rounded-[16px] ios-liquid-button text-white text-[15px] font-bold flex items-center justify-center hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isOtpLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : 'Verify & Sign In'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isOtpMode && (
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
                <span className="px-2 bg-[var(--theme-bg-base)] text-[var(--theme-text-secondary)] font-medium">or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={onGoogleClick}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-[13px] text-[var(--theme-text-secondary)]">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-[var(--theme-text-primary)] hover:text-[var(--color-accent)] transition-colors">
            Sign In &rarr;
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
