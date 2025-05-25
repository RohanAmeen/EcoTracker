import React, { createContext, useState, useContext } from 'react';
import { CommonActions } from '@react-navigation/native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navigation, setNavigation] = useState(null);
  // You can add more user info and auth functions here

  const signOut = () => {
    setIsLoggedIn(false);
    if (navigation) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, signOut, setNavigation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 