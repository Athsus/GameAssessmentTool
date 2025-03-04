import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // 检查本地存储中的认证状态
    const checkAuth = async () => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      const session = localStorage.getItem('adminSession');
      
      if (isAdmin && session) {
        // 验证会话是否仍然有效
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}; 