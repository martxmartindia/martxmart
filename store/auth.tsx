'use client'; // Mark as client component

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  role: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
}

interface AuthContextType extends AuthState {
  signOut: () => void;
  updateUser: (user: User | null) => void;
  setUser: (user: User | null) => void;
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
  const { data: session, status } = useSession();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    status: 'loading',
  });

  // Update state when NextAuth session changes
  useEffect(() => {
    if (status === 'loading') {
      setState(prev => ({ ...prev, isLoading: true, status: 'loading' }));
    } else if (status === 'authenticated' && session?.user) {
      setState({
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          phone: session.user.phone,
          image: session.user.image,
          role: session.user.role,
        },
        isLoading: false,
        error: null,
        status: 'authenticated',
      });
    } else {
      setState({
        user: null,
        isLoading: false,
        error: null,
        status: 'unauthenticated',
      });
    }
  }, [session, status]);

  const signOut = () => {
    // This will be handled by NextAuth
    window.location.href = '/';
  };

  const updateUser = (user: User | null) => {
    setState(prev => ({
      ...prev,
      user,
      error: null,
    }));
  };

  const setUser = (user: User | null) => {
    updateUser(user);
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
      updateUser(updatedUser);
    }
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const logout = () => {
    signOut();
  };

  const value: AuthContextType = {
    ...state,
    signOut,
    updateUser,
    setUser,
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