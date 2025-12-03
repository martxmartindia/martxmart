// app/store/author.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
  // Content State
  contents: AuthorContent[];
  currentContent: AuthorContent | null;
  contentLoading: boolean;
  contentError: string | null;
  // Analytics State
  analytics: AuthorAnalytics | null;
}

interface AuthorContextType extends AuthorState {
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
    contents: [],
    currentContent: null,
    contentLoading: false,
    contentError: null,
    analytics: null,
  });

  const setContents = (contents: AuthorContent[]) => {
    setState((prev) => ({ ...prev, contents }));
  };

  const setCurrentContent = (content: AuthorContent | null) => {
    setState((prev) => ({ ...prev, currentContent: content }));
  };

  const fetchContents = async () => {
    try {
      setState((prev) => ({ ...prev, contentLoading: true, contentError: null }));
      const response = await fetch('/api/author/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const contents = await response.json();
      setState((prev) => ({ ...prev, contents }));
    } catch (error) {
      setState((prev) => ({ ...prev, contentError: (error as Error).message }));
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
      setState((prev) => ({ ...prev, contents: [...prev.contents, newContent] }));
    } catch (error) {
      setState((prev) => ({ ...prev, contentError: (error as Error).message }));
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
      setState((prev) => ({
        ...prev,
        contents: prev.contents.map((c) => (c.id === id ? updatedContent : c)),
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, contentError: (error as Error).message }));
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
      setState((prev) => ({
        ...prev,
        contents: prev.contents.filter((c) => c.id !== id),
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, contentError: (error as Error).message }));
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
      setState((prev) => ({
        ...prev,
        contents: prev.contents.map((c) => (c.id === id ? publishedContent : c)),
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, contentError: (error as Error).message }));
    } finally {
      setState((prev) => ({ ...prev, contentLoading: false }));
    }
  };

  const fetchAnalytics = async () => {
    try {
      setState((prev) => ({ ...prev, contentLoading: true, contentError: null }));
      const response = await fetch('/api/author/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      setState((prev) => ({ ...prev, analytics: analyticsData }));
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setState((prev) => ({ ...prev, contentError: (error as Error).message }));
    } finally {
      setState((prev) => ({ ...prev, contentLoading: false }));
    }
  };

  const updateAnalytics = (data: Partial<AuthorAnalytics>) => {
    setState((prev) => ({
      ...prev,
      analytics: prev.analytics
        ? { ...prev.analytics, ...data }
        : { totalViews: 0, totalLikes: 0, totalComments: 0, readerEngagement: 0, ...data },
    }));
  };

  const value: AuthorContextType = {
    ...state,
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