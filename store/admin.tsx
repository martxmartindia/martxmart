// app/lib/admin/context.tsx
'use client'; // Mark as client component

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdminData {
  id: string;
  email: string;
  name: string;
  role: string;
} 

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  adminData: AdminData | null;
}

interface AdminContextType extends AdminState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setAdminData: (data: AdminData) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    isAuthenticated: false,
    isLoading: true, // Start with loading true for SSR
    isAdmin: false,
    adminData: null,
  });

  // Hydrate state from cookies on client-side mount
  useEffect(() => {
    const hydrateState = () => {
      try {
        if (typeof window !== 'undefined') {
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = value;
            return acc;
          }, {} as Record<string, string>);

          const token = cookies['token'] || null;

          // Optionally, fetch admin data from an API if token exists
          // For simplicity, we assume no adminData is stored in cookies
          setState({
            isAuthenticated: !!token,
            isLoading: false,
            isAdmin: !!token, // Adjust based on your logic
            adminData: null, // Fetch from API if needed
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    hydrateState();
  }, []);

  // Persist state to cookies
  const persistState = (newState: Partial<AdminState>) => {
    const updatedState = { ...state, ...newState };
    setState(updatedState);
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.token) {
        throw new Error('Authentication token not received');
      }

      if (!data.user || typeof data.user !== 'object') {
        throw new Error('Invalid user data received from server');
      }

      const adminData: AdminData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      };

      persistState({
        isAuthenticated: true,
        isAdmin: true,
        adminData,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const logout = () => {
    persistState({
      isAuthenticated: false,
      isAdmin: false,
      adminData: null,
    });
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setAdminData = (data: AdminData) => {
    setState((prev) => ({ ...prev, adminData: data }));
  };

  const value: AdminContextType = {
    ...state,
    login,
    logout,
    setLoading,
    setAdminData,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null; // Server-side
  try {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies['token'] || null;
  } catch {
    return null;
  }
};