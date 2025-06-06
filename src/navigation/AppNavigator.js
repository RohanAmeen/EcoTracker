import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../AuthContext';
import { CommonActions } from '@react-navigation/native';

import SplashScreen from '../screens/splashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ReportIncident from '../screens/ReportIncident';
import Profile from '../screens/Profile';
import ChangePassword from '../screens/ChangePassword';
import IncidentDetails from '../screens/IncidentDetails';
import ReportsScreen from '../screens/ReportsScreen';
import AdminDashboard from '../screens/AdminDashboard';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Stack = createStackNavigator();

/**
 * AppNavigator Component
 * Manages the navigation structure of the app
 * Handles authentication state and conditional rendering of screens
 * Implements a splash screen and different navigation stacks for users and admins
 */
const AppNavigator = () => {
  const { isLoggedIn, user, isAdmin } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Authentication Stack
          // Shown when user is not logged in
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : isAdmin ? (
          // Admin Stack
          // Shown when user is logged in and has admin privileges
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
          </>
        ) : (
          // User Stack
          // Shown when user is logged in as a regular user
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ReportIncident" component={ReportIncident} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="IncidentDetails" component={IncidentDetails} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
            <Stack.Screen name="Statistics" component={StatisticsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 