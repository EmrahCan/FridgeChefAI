import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, dietary?: string[]) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginWithEmail: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  deleteAccount: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = async () => {
    try {
      const current = await AuthService.getCurrentUser();
      setUser(current);
    } catch (e) {
      console.error('Error loading session', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await AuthService.loginWithEmail(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Giriş başarısız oldu.' };
  };

  const loginWithGoogle = async () => {
    const res = await AuthService.loginWithGoogle();
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: 'Google girişi başarısız oldu.' };
  };

  const register = async (name: string, email: string, pass: string, dietary: string[] = []) => {
    const res = await AuthService.register(name, email, pass, dietary);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Kayıt başarısız oldu.' };
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const deleteAccount = async () => {
    await AuthService.deleteAccount();
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        register,
        logout,
        deleteAccount,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
