import { createContext, useState, useCallback, useRef } from 'react';

export const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    // Clear the auto-dismiss timer if it's still running
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = `toast-${++toastIdCounter}`;
      const toast = { id, type, message, duration };

      setToasts((prev) => {
        // Prevent exact duplicates in the queue
        if (prev.some(t => t.message === message)) {
          return prev;
        }
        
        // Add new toast and limit to 1 maximum on mobile for cleanliness
        const newToasts = [...prev, toast];
        if (newToasts.length > 1) {
          // Clear timers for dropped toasts
          const dropped = newToasts.slice(0, newToasts.length - 1);
          dropped.forEach(d => {
            if (timersRef.current[d.id]) {
              clearTimeout(timersRef.current[d.id]);
              delete timersRef.current[d.id];
            }
          });
          return newToasts.slice(-1);
        }
        return newToasts;
      });

      // Auto-dismiss after duration
      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
