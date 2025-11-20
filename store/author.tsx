// app/lib/author/context.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Author {
  id: string;
  userId: string;
  name: string;
  email?: string;
  password?: string;
  imageUrl?: string;
  bio?: string;
  specialty?: string[];
  location?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorContent {
  id: string;
  title: string;
  description?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
  readTime?: number;
}

export interface AuthorAnalytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  readerEngagement: number;
  topPerformingContent?: {
    contentId: string;
    title: string;
    views: number;
    engagement: number;
  }[];
  weeklyStats?: {
    week: string;
    views: number;
    likes: number;
    comments: number;
  }[];
}

interface AuthorState {
  // Auth State
  author: Author | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  // Content State
  contents: AuthorContent[];
  currentContent: AuthorContent | null;
  contentLoading: boolean;
  contentError: string | null;
  // Analytics State
  analytics: AuthorAnalytics | null;
}

interface AuthorContextType extends AuthorState {
  // Auth Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuthor: (author: Author | null) => void;
  updateAuthor: (data: Partial<Author>) => Promise<void>;
  updateAuthorImage: (imageUrl: string) => Promise<void>;
  // Content Actions
  setContents: (contents: AuthorContent[]) => void;
  setCurrentContent: (content: AuthorContent | null) => void;
  fetchContents: () => Promise<void>;
  createContent: (content: Partial<AuthorContent>) => Promise<void>;
  updateContent: (id: string, data: Partial<AuthorContent>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  publishContent: (id: string) => Promise<void>;
  // Analytics Actions
  fetchAnalytics: () => Promise<void>;
  updateAnalytics: (data: Partial<AuthorAnalytics>) => void;
}

const AuthorContext = createContext<AuthorContextType | undefined>(undefined);

interface AuthorProviderProps {
  children: ReactNode;
}

export const AuthorProvider: React.FC<AuthorProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthorState>({
    author: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
    contents: [],
    currentContent: null,
    contentLoading: false,
    contentError: null,
    analytics: null,
  });

  // Hydrate state from localStorage on client-side mount
  useEffect(() => {
    const hydrateState = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedData = localStorage.getItem('author-storage');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            setState((prev) => ({
              ...prev,
              author: parsed.author || null,
              isAuthenticated: !!parsed.author,
              contents: parsed.contents || [],
              currentContent: parsed.currentContent || null,
              analytics: parsed.analytics || null,
              isLoading: false,
            }));
          } else {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState((prev) => ({ ...prev, error: 'Failed to hydrate state', isLoading: false }));
      }
    };

    hydrateState();
  }, []);

  // Persist state to localStorage
  const persistState = (newState: Partial<AuthorState>) => {
    const updatedState = { ...state, ...newState };
    if (typeof window !== 'undefined') {
      localStorage.setItem('author-storage', JSON.stringify(updatedState));
    }
    setState(updatedState);
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('/api/auth/author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'Login failed');
      }

      const data = await response.json();
      persistState({ author: data.author, isAuthenticated: true });
    } catch (error) {
      persistState({ error: (error as Error).message, isAuthenticated: false });
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await fetch('/api/auth/author/logout', { method: 'POST' });
      persistState({ author: null, isAuthenticated: false, contents: [], currentContent: null, analytics: null });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const setAuthor = (author: Author | null) => {
    persistState({ author, isAuthenticated: !!author });
  };

  const updateAuthor = async (data: Partial<Author>) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('/api/author/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update author');
      const updatedAuthor = await response.json();
      persistState({
        author: state.author ? { ...state.author, ...updatedAuthor } : null,
      });
    } catch (error) {
      persistState({ error: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateAuthorImage = async (imageUrl: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('/api/author/image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      if (!response.ok) throw new Error('Failed to update author image');
      persistState({
        author: state.author ? { ...state.author, imageUrl } : null,
      });
    } catch (error) {
      persistState({ error: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const setContents = (contents: AuthorContent[]) => {
    persistState({ contents });
  };

  const setCurrentContent = (content: AuthorContent | null) => {
    persistState({ currentContent: content });
  };

  const fetchContents = async () => {
    try {
      setState((prev) => ({ ...prev, contentLoading: true, contentError: null }));
      const response = await fetch('/api/author/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const contents = await response.json();
      persistState({ contents });
    } catch (error) {
      persistState({ contentError: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, contentLoading: false }));
    }
  };

  const createContent = async (content: Partial<AuthorContent>) => {
    try {
      setState((prev) => ({ ...prev, contentLoading: true, contentError: null }));
      const response = await fetch('/api/author/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error('Failed to create content');
      const newContent = await response.json();
      persistState({ contents: [...state.contents, newContent] });
    } catch (error) {
      persistState({ contentError: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, contentLoading: false }));
    }
  };

  const updateContent = async (id: string, data: Partial<AuthorContent>) => {
    try {
      setState((prev) => ({ ...prev, contentLoading: true, contentError: null }));
      const response = await fetch(`/api/author/contents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update content');
      const updatedContent = await response.json();
      persistState({
        contents: state.contents.map((c) => (c.id === id ? updatedContent : c)),
      });
    } catch (error) {
      persistState({ contentError: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, contentLoading: false }));
    }
  };

  const deleteContent = async (id: string) => {
    try {
      setState((prev) => ({ ...prev, contentLoading: true, contentError: null }));
      const response = await fetch(`/api/author/contents/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete content');
      persistState({
        contents: state.contents.filter((c) => c.id !== id),
      });
    } catch (error) {
      persistState({ contentError: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, contentLoading: false }));
    }
  };

  const publishContent = async (id: string) => {
    try {
      setState((prev) => ({ ...prev, contentLoading: true, contentError: null }));
      const response = await fetch(`/api/author/contents/${id}/publish`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to publish content');
      const publishedContent = await response.json();
      persistState({
        contents: state.contents.map((c) => (c.id === id ? publishedContent : c)),
      });
    } catch (error) {
      persistState({ contentError: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, contentLoading: false }));
    }
  };

  const fetchAnalytics = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('/api/author/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      persistState({ analytics: analyticsData });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      persistState({ error: (error as Error).message });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateAnalytics = (data: Partial<AuthorAnalytics>) => {
    persistState({
      analytics: state.analytics
        ? { ...state.analytics, ...data }
        : { totalViews: 0, totalLikes: 0, totalComments: 0, readerEngagement: 0, ...data },
    });
  };

  const value: AuthorContextType = {
    ...state,
    login,
    logout,
    setAuthor,
    updateAuthor,
    updateAuthorImage,
    setContents,
    setCurrentContent,
    fetchContents,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    fetchAnalytics,
    updateAnalytics,
  };

  return <AuthorContext.Provider value={value}>{children}</AuthorContext.Provider>;
};

export const useAuthor = (): AuthorContextType => {
  const context = useContext(AuthorContext);
  if (!context) {
    throw new Error('useAuthor must be used within an AuthorProvider');
  }
  return context;
};

export const getAuthorData = (): Author | null => {
  if (typeof window === 'undefined') return null; // Server-side
  try {
    const storedData = localStorage.getItem('author-storage');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      return parsed.author || null;
    }
    return null;
  } catch {
    return null;
  }
};