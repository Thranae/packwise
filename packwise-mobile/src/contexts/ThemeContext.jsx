import { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, THEMES, DEFAULT_THEME } from '../constants/app';
import * as userService from '../services/user.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext(null);

/**
 * Applies the given theme to AsyncStorage.
 */
async function applyTheme(theme) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  } catch (e) {
    console.warn(e);
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);

  useEffect(() => {
    // Read persisted theme; fall back to the app default
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed === THEMES.LIGHT || parsed === THEMES.DARK) setThemeState(parsed);
        }
      } catch {
        // ignore parse errors
      }
    };
    loadTheme();
  }, []);

  // Apply the theme class whenever the state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /**
   * Set theme without syncing to the server.
   * Used by AuthContext to restore the user's saved preference on login.
   */
  const setTheme = useCallback((newTheme) => {
    if (newTheme === THEMES.LIGHT || newTheme === THEMES.DARK) {
      setThemeState(newTheme);
    }
  }, []);

  /**
   * Toggle between light and dark mode and persist to the server.
   */
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

      // Fire-and-forget server sync — failures are silently ignored so the
      // UI remains responsive even if the backend is unreachable.
      userService.updateTheme(next).catch(() => {});

      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
