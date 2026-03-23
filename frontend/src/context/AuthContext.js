import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, signupUser } from '../api/auth';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const SESSION_BOOT_KEY = 'auth_session_bootstrapped';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data?.data || null);
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const hasBootstrapped = sessionStorage.getItem(SESSION_BOOT_KEY);
      if (!hasBootstrapped) {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.setItem(SESSION_BOOT_KEY, 'true');
      }

      const token = sessionStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchCurrentUser();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async ({ email, password }) => {
    const response = await loginUser({ email, password });
    const token = response.data?.data?.token;
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      await fetchCurrentUser();
    }
    return response;
  };

  const signup = async ({ name, email, password, inviteCode }) => {
    const response = await signupUser({ name, email, password, inviteCode });
    const token = response.data?.data?.token;
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      await fetchCurrentUser();
    }
    return response;
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
