import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LogoIcon } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/constants/routes';
import { signupSchema } from '@/constants/validation';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const toast = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      // Redirect to onboarding after successful signup
      navigate(ROUTES.ONBOARDING, { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'An error occurred during signup.'
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full flex flex-col font-sans"
    >
      {/* Small Top Logo */}
      <div className="mb-5">
        <div className="w-12 h-12 rounded-[16px] flex items-center justify-center bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 shadow-sm">
          <LogoIcon size="sm" className="text-[var(--color-accent)]" />
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[var(--theme-text-primary)] tracking-tight mb-2">
          Create Account
        </h2>
        <p className="text-[15px] text-[var(--theme-text-secondary)] font-light leading-relaxed">
          Start your journey with Voyage Genie today.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Name Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[var(--theme-text-secondary)] opacity-70" />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              {...register('name')}
              className={`w-full h-[52px] glass-input pl-11 pr-4 text-[15px] font-medium placeholder-[var(--theme-text-secondary)] transition-all ${errors.name ? '!border-red-500' : ''}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-400 pl-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[var(--theme-text-secondary)] opacity-70" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              {...register('email')}
              className={`w-full h-[52px] glass-input pl-11 pr-4 text-[15px] font-medium placeholder-[var(--theme-text-secondary)] transition-all ${errors.email ? '!border-red-500' : ''}`}
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[var(--theme-text-secondary)] opacity-70" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className={`w-full h-[52px] glass-input pl-11 pr-11 text-[15px] font-medium placeholder-[var(--theme-text-secondary)] transition-all ${errors.password ? '!border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5 opacity-70" /> : <Eye className="h-5 w-5 opacity-70" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400 pl-1">{errors.password.message}</p>
            )}
          </div>

          <div className="w-1/2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[var(--theme-text-secondary)] opacity-70" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm"
                {...register('confirmPassword')}
                className={`w-full h-[52px] glass-input pl-11 pr-11 text-[15px] font-medium placeholder-[var(--theme-text-secondary)] transition-all ${errors.confirmPassword ? '!border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 opacity-70" /> : <Eye className="h-5 w-5 opacity-70" />}
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
          disabled={isSubmitting}
          className="w-full h-[52px] rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[15px] font-semibold flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20 hover:shadow-xl hover:shadow-[var(--color-accent)]/30 hover:-translate-y-0.5 transition-all duration-700 disabled:opacity-70 disabled:pointer-events-none mt-2"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--theme-border-subtle)]"></div>
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="px-3 bg-transparent backdrop-blur-md rounded-full border border-[var(--theme-border-subtle)] py-1 text-[var(--theme-text-secondary)] font-medium">or sign up with</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="w-full h-[52px] rounded-[16px] glass-card text-[var(--theme-text-primary)] text-[15px] font-medium flex items-center justify-center gap-3 hover:bg-[var(--theme-bg-surface)] transition-all duration-700 shadow-sm hover:-translate-y-0.5"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[14px] text-[var(--theme-text-secondary)]">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-[var(--theme-text-primary)] hover:text-[var(--color-accent)] transition-colors">
            Log In &rarr;
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

