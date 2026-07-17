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

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
    setIsAuthenticated(false);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  /**
   * Merge updated user data into the current user state.
   * Used after profile updates without needing to refetch from the server.
   *
   * @param {object} userData - Partial user object with updated fields.
   */
  const updateUser = useCallback((userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : userData));
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
