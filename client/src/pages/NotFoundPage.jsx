import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Spline from '@splinetool/react-spline';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-6 py-24 text-center dark:bg-surface-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col items-center"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
          <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-primary-600 dark:text-primary-400">404</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="mt-10 flex justify-center">
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}>
            <Button size="lg">Go back home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

