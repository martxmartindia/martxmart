'use client'; // Mark as client component

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  phone?: string;
  bio?: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => void;
  updateUser: (user: User | null) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true, // Start with loading true for SSR
    error: null,
    isAdmin: false,
  });

  // Hydrate state from localStorage on client-side mount
  useEffect(() => {
    const hydrateState = () => {
      try {
        if (typeof window !== 'undefined') {
          const authData = localStorage.getItem('auth-storage');
          if (authData) {
            const parsed = JSON.parse(authData);
            setState({
              user: parsed.state?.user || null,
              token: parsed.state?.token || null,
              isLoading: false,
              error: null,
              isAdmin: parsed.state?.user?.isAdmin || false,
            });
            return;
          }
        }
        setState((prev) => ({ ...prev, isLoading: false }));
      } catch {
        setState((prev) => ({ ...prev, isLoading: false, error: 'Failed to load auth data' }));
      }
    };

    hydrateState();
  }, []);

  // Persist state to localStorage
  const persistState = (newState: Partial<AuthState>) => {
    const updatedState = { ...state, ...newState };
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-storage', JSON.stringify({ state: updatedState }));
    }
    setState(updatedState);
  };

  const signOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
    }
    setState({ user: null, token: null, isLoading: false, error: null, isAdmin: false });
  };

  const updateUser = (user: User | null) => {
    persistState({ user, error: null, isAdmin: user?.isAdmin || false });
  };

  const setUser = (user: User | null) => {
    persistState({ user, error: null, isAdmin: user?.isAdmin || false });
  };

  const setToken = (token: string | null) => {
    persistState({ token, error: null });
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (state.user) {
      const updatedUser = {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...preferences,
        },
      };
      persistState({ user: updatedUser });
    }
  };

  const setError = (error: string | null) => {
    persistState({ error });
  };

  const setLoading = (isLoading: boolean) => {
    persistState({ isLoading });
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
    }
    setState({ user: null, token: null, error: null, isLoading: false, isAdmin: false });
  };

  const value: AuthContextType = {
    ...state,
    signOut,
    updateUser,
    setUser,
    setToken,
    updateUserPreferences,
    setError,
    setLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null; // Server-side
  try {
    const authData = localStorage.getItem('auth-storage');
    if (!authData) return null;
    const parsed = JSON.parse(authData);
    return parsed.state?.token || null;
  } catch {
    return null;
  }
};