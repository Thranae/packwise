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
        <div className="w-64 h-64 mx-auto mb-2 relative pointer-events-none mix-blend-screen">
          <Spline scene="https://prod.spline.design/qi0d6jLF61ChsayE/scene.splinecode" />
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

