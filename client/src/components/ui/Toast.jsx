import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5 text-success-500" />,
  error: <XCircle className="h-5 w-5 text-error-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning-500" />,
  info: <Info className="h-5 w-5 text-info-500" />,
};

const borderColors = {
  success: 'border-l-success-500',
  error: 'border-l-error-500',
  warning: 'border-l-warning-500',
  info: 'border-l-info-500',
};

export const Toast = ({ type = 'info', message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`glass-card pointer-events-auto flex w-full max-w-sm items-center gap-3 overflow-hidden p-4 border-l-4 ${borderColors[type]}`}
      style={{ borderRadius: '20px' }}
    >
      <div className="flex-shrink-0 drop-shadow-sm">{icons[type]}</div>
      <div className="flex-1 w-0">
        <p className="text-sm font-medium text-text-primary">{message}</p>
      </div>
      <div className="ml-4 flex flex-shrink-0">
        <button
          type="button"
          className="inline-flex rounded-md text-text-secondary hover:text-text-primary focus:outline-none transition-colors"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
