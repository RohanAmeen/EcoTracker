import React, { createContext, useState, useContext, useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from './services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        // Check if user is admin
        const isAdminUser = parsedUser.email.endsWith('@admin.com');
        setIsAdmin(isAdminUser);
      } else {
        // If no token or user data, ensure we're logged out
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, ensure we're logged out
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear auth data from storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      // Reset auth state
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, ensure we're logged out
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        setIsLoggedIn, 
        user,
        setUser,
        signOut, 
        setNavigation,
        loading,
        isAdmin,
        setIsAdmin
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