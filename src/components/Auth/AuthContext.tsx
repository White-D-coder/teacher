'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id?: string;
  name: string;
  class: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateClass: (newClass: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch (e) {
        console.error("Failed to fetch user session from API", e);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // Ideally call /api/auth/logout to clear HttpOnly cookie
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const updateClass = (newClass: string) => {
    if (user) {
      const updatedUser = { ...user, class: newClass };
      setUser(updatedUser);
      // Backend update requires API call to patch user, ignoring here since it's mock
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateClass, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
