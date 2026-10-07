import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await API.get('/profile'); 
        setUser(response.data.user || response.data);
      } catch (error) {
        localStorage.clear();
        setUser(null);
      }
    };
    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        password: password 
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { success: true, role: response.data.user.role };
      }
      return { success: false, message: 'Invalid payload response structure' };
    } catch (error) {
      // 🌟 डीप एरर एक्सट्रैक्टर: बैकएंड के हर तरह के रिस्पॉन्स एरर मैसेज को कैप्चर करना
      const serverMessage = error.response?.data?.message || error.response?.data?.error || 'Wrong Password or Account does not exist!';
      return { success: false, message: serverMessage };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
