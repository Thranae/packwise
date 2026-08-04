import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants/app';
import { ROUTES } from '../constants/routes';
import * as authService from '../services/auth.service';
import { ThemeContext } from './ThemeContext';
import { db } from '../db/db';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { setTheme } = useContext(ThemeContext);

  // On mount — rehydrate auth state from a persisted token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response.success && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);

          // Restore the user's saved theme preference
          if (response.data.theme) {
            setTheme(response.data.theme);
          }
        }
      } catch {
        // Token is invalid or expired — clean up
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Authenticate a user with email + password.
   * Stores the JWT, sets user state, and restores the server-side theme.
   *
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<object>} The raw API response so the caller can inspect it.
   */
  const login = useCallback(
    async (credentials) => {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        localStorage.setItem(
          STORAGE_KEYS.TOKEN,
          JSON.stringify(response.data.token),
        );
        setUser(response.data.user);
        setIsAuthenticated(true);

        // Sync the user's theme preference
        if (response.data.user?.theme) {
          setTheme(response.data.user.theme);
        }
      }

      return response;
    },
    [setTheme],
  );

  /**
   * Register a new user account.
   * Stores the JWT and sets user state.
   *
   * @param {object} data - Signup form data.
   * @returns {Promise<object>} The raw API response.
   */
  const signup = useCallback(
    async (data) => {
      const response = await authService.signup(data);

      if (response.success && response.data) {
        localStorage.setItem(
          STORAGE_KEYS.TOKEN,
          JSON.stringify(response.data.token),
        );
        setUser(response.data.user);
        setIsAuthenticated(true);

        if (response.data.user?.theme) {
          setTheme(response.data.user.theme);
        }
      }

      return response;
    },
    [setTheme],
  );

  /**
   * Log the user out, clear local state, and redirect to the login page.
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the server call fails we still want to clear local state
    }

    try {
      // Clear all local-first Dexie data
      await Promise.all(db.tables.map(table => table.clear()));
    } catch (e) {
      console.error("Failed to clear local database", e);
    }

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
    setIsAuthenticated(false);
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  const updateUser = useCallback((userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : userData));
  }, []);

  const updateTravelPreferences = useCallback(async (preferences) => {
    try {
      const response = await authService.updatePreferences(preferences);
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to update travel preferences:', error);
      // Fallback optimistic update if API fails
      setUser((prev) => {
        const updatedUser = { 
          ...prev, 
          travelPreferences: { ...(prev?.travelPreferences || {}), ...preferences } 
        };
        return updatedUser;
      });
    }
  }, []);

  /**
   * Directly set auth data (user + token) from external auth flows (e.g. Google OAuth).
   * @param {object} userData - The user object from the API.
   * @param {string} token - The JWT token.
   */
  const setAuthData = useCallback((userData, token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));
    setUser(userData);
    setIsAuthenticated(true);
    if (userData?.theme) {
      setTheme(userData.theme);
    }
  }, [setTheme]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        updateTravelPreferences,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
