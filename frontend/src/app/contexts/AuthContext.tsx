'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // return User so callers can check role immediately
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);


  // Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const t = localStorage.getItem('token');
      const u = localStorage.getItem('user');
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  // Keep token in localStorage
  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
    } catch {}
  }, [token]);

useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    } catch {}
  }, [user]);

  useEffect(() => {
    (async () => {
      if (token && !user) {
        try {
          const res = await apiFetch('/auth/profile');
          setUser(res?.user ?? null);
        } catch {
          setToken(null);
          setUser(null);
        }
      }
    })();
  }, [token, user]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setUser(res.user);
    return res.user as User; // ← return the user
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setToken(res.token);
    setUser(res.user);
    return res.user as User; 
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo( () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;


}
