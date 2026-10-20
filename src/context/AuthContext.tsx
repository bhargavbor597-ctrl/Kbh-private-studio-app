import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('khb_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('khb_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyAuth() {
      const savedToken = localStorage.getItem('khb_admin_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.adminGetMe();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('khb_admin_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Admin session expired or invalid:', err);
        localStorage.removeItem('khb_admin_token');
        localStorage.removeItem('khb_admin_user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.adminLogin(email, password);
      if (res.success && res.token && res.user) {
        localStorage.setItem('khb_admin_token', res.token);
        localStorage.setItem('khb_admin_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.adminLogout();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
