import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/index.js';
import { ApiClient } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  pointsBalance: number;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await ApiClient.getCurrentUser();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        // Fallback demo user (traveler) if initial load
        await switchRole('traveler');
      }
    } catch (e) {
      console.error('Error loading current user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    const res = await ApiClient.login(email);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    setIsLoading(false);
    return res;
  };

  const register = async (name: string, email: string) => {
    setIsLoading(true);
    const res = await ApiClient.register(name, email);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    setIsLoading(false);
    return res;
  };

  const logout = () => {
    ApiClient.removeToken();
    switchRole('traveler');
  };

  const switchRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    const res = await ApiClient.switchDemoRole(targetRole);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    setIsLoading(false);
  };

  const refreshUserData = async () => {
    const res = await ApiClient.getCurrentUser();
    if (res.success && res.data) {
      setUser(res.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'traveler',
        pointsBalance: user?.pointsBalance || 0,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
