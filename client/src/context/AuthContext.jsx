import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('techfest_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('techfest_token');
      const storedUser = localStorage.getItem('techfest_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await authApi.getMe();
          if (res.data && res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('techfest_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data && res.data.success) {
      const { token: receivedToken, ...userData } = res.data.data;
      setToken(receivedToken);
      setUser(userData);
      localStorage.setItem('techfest_token', receivedToken);
      localStorage.setItem('techfest_user', JSON.stringify(userData));
      return { success: true, user: userData, message: res.data.message };
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.data && res.data.success) {
      const { token: receivedToken, ...createdUser } = res.data.data;
      setToken(receivedToken);
      setUser(createdUser);
      localStorage.setItem('techfest_token', receivedToken);
      localStorage.setItem('techfest_user', JSON.stringify(createdUser));
      return { success: true, user: createdUser, message: res.data.message };
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('techfest_token');
    localStorage.removeItem('techfest_user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('techfest_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateUser,
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

export default AuthContext;
