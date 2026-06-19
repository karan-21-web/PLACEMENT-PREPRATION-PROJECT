import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

 export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists on mount and fetch user details
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('preppilot_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('[AuthContext] Token validation failed on boot:', error.message);
          localStorage.removeItem('preppilot_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('preppilot_token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('preppilot_token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('preppilot_token');
    setUser(null);
  };

  const googleLogin = async (firebaseUser) => {
  try {
    const response = await api.post('/auth/google', {
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      photo: firebaseUser.photoURL,
    });

    const { token, ...userData } = response.data;

    localStorage.setItem('preppilot_token', token);
    setUser(userData);

    return userData;
  } catch (error) {
    throw error;
  }
};

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile,  googleLogin  }}>
      {children}
    </AuthContext.Provider>
  );
};

// Note: `useAuth` hook is provided in `src/hooks/useAuth.js` to avoid
// duplicate hook definitions across the codebase.
